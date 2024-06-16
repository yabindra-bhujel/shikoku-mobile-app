from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, BackgroundTasks
from sqlalchemy.orm import Session
from ..models.database import get_db
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from .logic import AuthLogic
from .schema import *
from datetime import timedelta


router = APIRouter(prefix="/auth", tags=["auth"])
db_dependency = Annotated[Session, Depends(get_db)]
auth_logic = AuthLogic()

@router.post("/create_user", status_code=status.HTTP_201_CREATED,
             description="Create a new user with the provided credentials. Returns HTTP 400 if user already exists.The role field should be one of 'admin', 'staff', 'student', 'teacher', or 'user'.")
async def create_user(db: db_dependency, credentials: Credentials):
    user = auth_logic.create_user(db, credentials.dict())
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    return {"message": "User created successfully"}

@router.post("/access_token", status_code=status.HTTP_200_OK)
async def login_for_access_token(response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends(OAuth2PasswordRequestForm)], db: db_dependency):
    access_token, refresh_token = auth_logic.login_token(db, form_data.username, form_data.password)
    if access_token and refresh_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    response.set_cookie(key="access_token", value=access_token, httponly=True)
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    return {"message": "Login successful"}

@router.post("/refresh_token", status_code=status.HTTP_200_OK)
async def refresh_access_token(request: Request, response: Response, db: db_dependency):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")

    payload = auth_logic.verify_token(refresh_token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user_id = int(payload["sub"])
    user = auth_logic.get_user_by_user_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = auth_logic.create_access_token(
        username=user.username,
        user_id=int(payload["sub"]),
        email=user.email,
        role=user.role,
        expires_delta=timedelta(minutes=15)
    )
    response.set_cookie(key="access_token", value=new_access_token, httponly=True)
    return {"message": "Access token refreshed"}


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user = auth_logic.current_user(token)
        if user is None or not all(key in user for key in ['username', 'email', 'role']):
            raise credentials_exception
        return User(**user)
    except JWTError:
        raise credentials_exception

@router.get("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response, request: Request):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

@router.post("/change_password", status_code=status.HTTP_200_OK)
async def change_password(db: db_dependency, credentials: ChangePassword, user: User = Depends(get_current_user)):
    password_changed = auth_logic.change_password(db, user.username, credentials.old_password, credentials.new_password)
    if password_changed is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")
    
    return {"message": "Password changed successfully"}


@router.post("/password_reset_link", status_code=status.HTTP_200_OK)
def password_reset(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    password_reset_link = auth_logic.password_reset_link(db=db, email=email, background_tasks=background_tasks)
    if password_reset_link is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not found")
    return {"message": "Password reset link sent to your email"}


@router.get("/password_reset_confirm/{token}", status_code=status.HTTP_200_OK)
def password_reset_confirm(token: str, db: Session = Depends(get_db)):
    if not auth_logic.verify_password_reset_token(db, token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    return {"message": "Password reset link verified"}
