from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, BackgroundTasks,  File, UploadFile, Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from datetime import timedelta
import logging
import csv
from io import StringIO
from .logic import AuthLogic
from .schema import *
from ..models.database import get_db
from ..models.entity.user_profile import UserProfile
from ..BusinessLogic.settings.AuthSettingLogic import AuthSettingLogic

logger = logging.getLogger(__name__)


# ルーターの作成
router = APIRouter(prefix="/auth", tags=["auth"])
# 依存関係の設定
db_dependency = Annotated[Session, Depends(get_db)]

# ロジックのインスタンス化
auth_logic = AuthLogic()
auth_setting_logic = AuthSettingLogic()

# ユーザー作成
@router.post("/create_user", status_code=status.HTTP_201_CREATED,
             description="Create a new user with the provided credentials. Returns HTTP 400 if user already exists.The role field should be one of 'admin', 'staff', 'student', 'teacher', or 'user'.")
async def create_user(db: db_dependency, credentials: Credentials):
    try:
        # ユーザーを作成されたら、ユーザーを返す くれない場合は、HTTP 400 を返す
        user = auth_logic.create_user(db, credentials.dict())

        if user is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

        return {"message": "User created successfully"}
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

# ログイン
@router.post("/access_token", status_code=status.HTTP_200_OK)
async def login_for_access_token(response: Response, background_tasks: BackgroundTasks, form_data: Annotated[OAuth2PasswordRequestForm, Depends(OAuth2PasswordRequestForm)], db: db_dependency):
    try:

        user = auth_logic.authenticate_user(form_data.username, form_data.password, db)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
        
        need_two_factor_auth = auth_setting_logic.have_two_factor_auth(db, user)
        if need_two_factor_auth:
            otp = auth_setting_logic.generate_otp(db, user)
            auth_setting_logic.send_otp(user, otp, background_tasks)
            return {"message": "OTP sent to your email", "expires_at": otp.expires_at}
        
        access_token, refresh_token = auth_logic.login_token(db, form_data.username, form_data.password)

        # アクセストークンとリフレッシュトークンがない場合
        if access_token and refresh_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

        # アクセストークンをクッキーにセット
        response.set_cookie(key="access_token", value=access_token, httponly=True)
        response.set_cookie(key="refresh_token", value=refresh_token)

        # リフレッシュトークンをresponse で返す
        return {"message": "Login successful", "refresh_token": refresh_token}
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")


@router.post("/refresh_token", status_code=status.HTTP_200_OK)
async def refresh_access_token(request: Request, response: Response, db: db_dependency, data: RefreshTokenRequest):
    try:
        # リクエストからトークンを取得
        refresh_token = data.token
        if refresh_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")
        

        # トークンの有効性を検証
        payload = auth_logic.verify_token(refresh_token)

        if payload is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        # ユーザー id を取得
        user_id = int(payload["sub"])

        # ユーザid からユーザーを取得
        user = auth_logic.get_user_by_user_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        # 新しいアクセストークンを生成
        new_access_token = auth_logic.create_access_token(
            username=user.username,
            user_id=int(payload["sub"]),
            email=user.email,
            role=user.role,
            expires_delta=timedelta(minutes=15)
        )
        # 新しいアクセストークンをクッキーにセット 
        response.set_cookie(key="access_token", value=new_access_token, httponly=True)

        return {"message": "Access token refreshed"}

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")



# ユーザー情報取得エンドポイント (GET /auth/get_current_user)
async def get_current_user(request: Request):

    # リクエストからトークンを取得
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    # エラー内容をまとめる
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        # トークンからユーザーを取得
        user = auth_logic.current_user(token)

        # ユーザーが存在しない場合
        if user is None or not all(key in user for key in ['username', 'email', 'role']):
            raise credentials_exception
        
        # ユーザーを返す
        return User(**user)
    except JWTError:
        # JWT エラーの場合
        raise credentials_exception


@router.get("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response, request: Request):
    # レスポンスからクッキーを削除
    response.delete_cookie("access_token")


@router.post("/change_password", status_code=status.HTTP_200_OK)
async def change_password(db: db_dependency, credentials: ChangePassword, user: User = Depends(get_current_user)):

    try:
        # パスワードを変更
        password_changed = auth_logic.change_password(db, user.username, credentials.old_password, credentials.new_password)

        # パスワードが変更されない場合
        if password_changed is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")
        
        return {"message": "Password changed successfully"}
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")


@router.post("/password_reset_link", status_code=status.HTTP_200_OK)
def password_reset(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        # パスワードリセットリンクを生成 し ユーザに送信　
        password_reset_link = auth_logic.password_reset_link(db=db, email=email, background_tasks=background_tasks)

        if password_reset_link is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not found")
        
        return {"message": "Password reset link sent to your email"}
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not found")


@router.get("/password_reset_confirm/{token}", status_code=status.HTTP_200_OK)
def password_reset_confirm(token: str, db: Session = Depends(get_db)):
    try:
        # パスワードリセットリンクの有効性を検証
        if not auth_logic.verify_password_reset_token(db, token):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
        
        return {"message": "Password reset link verified"}
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")


@router.get("/get_current_user", status_code=status.HTTP_200_OK)
async def current_user(request: Request, db: db_dependency, user: User = Depends(get_current_user)):
    user_info = {
        "id":user.id,
        "username": user.username,
        "email": user.email,
        "image": None,
        "fullname": None,

    }
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not user_profile:
        user_profile = UserProfile(user_id=user.id)

    if user_profile.profile_picture:
        user_info["image"] = str(request.url_for('static', path=user_profile.profile_picture))
    
    if user_profile.first_name and user_profile.last_name:
        user_info["fullname"] = f"{user_profile.first_name} {user_profile.last_name}"

    return user_info


# TODO:: background taskに変更したい
@router.post("/create_user_from_csv", status_code=status.HTTP_201_CREATED)
async def create_user_from_csv(db: db_dependency, background_tasks: BackgroundTasks, file: UploadFile = File(...), user: User = Depends(get_current_user)):
    try:
        # ファイルを読み込む
        contents = await file.read()

        csv_reader = csv.DictReader(StringIO(contents.decode("utf-8")))

        for row in csv_reader:
            auth_logic.create_user_from_file(db, row)

        return {"message": "Users created successfully"}
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



@router.post("/otp_verification", status_code=status.HTTP_200_OK)
def otp_verification(response: Response, db: db_dependency, otp: str, username: str, password: str):
    try:
        # OTP 検証
        verified = auth_setting_logic.verify_otp(db, otp)
        print(verified)

        if not verified:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
        
        # OTP 検証成功 access_token と refresh_token を生成
        access_token, refresh_token = auth_logic.login_token(db, username, password)
        # アクセストークンをクッキーにセット
        response.set_cookie(key="access_token", value=access_token, httponly=True)
        response.set_cookie(key="refresh_token", value=refresh_token)

        # リフレッシュトークンをresponse で返す
        return {"message": "Login successful", "refresh_token": refresh_token}
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")