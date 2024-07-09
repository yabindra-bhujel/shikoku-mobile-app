from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Request
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..models.entity.user_profile import UserProfile
from ..models.entity.users import User
from ..auth.router import get_current_user
import shutil
from ..schemas.user_profile import *
import os

# ユーザ プロファイル api の ルータ
router = APIRouter(prefix="/user_profile", tags=["User"])

# Dependency to get database session
db_dependency = Depends(get_db)

# ユーザ プロファイルの作成
@router.post("", status_code=status.HTTP_201_CREATED, response_model=UserProfileOutput)
async def create_user(user_profile: UserProfileInput, request: Request, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if user_profile:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User profile already exists")
        
        new_user_profile = UserProfile(
            first_name=user_profile.first_name,
            last_name=user_profile.last_name,
            bio=user_profile.bio,
            user_id=user.id
        )
        
        # データベースに保存
        db.add(new_user_profile)
        db.commit()
        db.refresh(new_user_profile)
        

        return new_user_profile  
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/upload_profile_picture", status_code=status.HTTP_200_OK)
async def upload_profile_picture(
    request: Request,
    file: UploadFile = File(...),
    db: Session = db_dependency,
    user: User = Depends(get_current_user)
):
    try:
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if not user_profile:
            user_profile = UserProfile(user_id=user.id)
            db.add(user_profile)

        # 写真を 保存される path
        file_path = os.path.join("static", "user_profile", f"{user.id}.png")
        
        # ユーザの 写真変更は Transaction で やる もし 写真が　消されて 新しい 写真が追加 できなった場合は自動で 返してくれる
        with db.begin_nested():
            # 古い 写真を消す
            if user_profile.profile_picture:
                old_file_path = os.path.join("static", user_profile.profile_picture)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            #新しい写真の追加
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            user_profile.profile_picture = f"user_profile/{user.id}.png"

            db.add(user_profile)  

        db.commit()  
        db.refresh(user_profile)
        
        # Construct the full URL for the profile picture
        profile_picture_url = request.url_for('static', path=user_profile.profile_picture)

        return {"message": "Profile picture uploaded successfully", "profile_picture_url": profile_picture_url}

    except Exception as e:
        # エラーが 発生したら 元のデータに戻す
        db.rollback()  
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# ユーザ プロファイルの取得
@router.get("", status_code=status.HTTP_200_OK)
async def get_profile(request: Request, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()

        if not user_profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
        
        profile_output = {
            "user_id": user.id,
            "first_name": user_profile.first_name,
            "last_name": user_profile.last_name,
            "bio": user_profile.bio,
            "update_profile": None 
        }

        if user_profile.profile_picture:
            profile_output["update_profile"] = str(request.url_for('static', path=user_profile.profile_picture))
        
        return profile_output
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



# ユーザ プロファイルの更新
@router.put("", status_code=status.HTTP_200_OK, response_model=UserProfileOutput)
async def update_profile(user_profile: UserProfileInput, request: Request, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        existing_user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if not existing_user_profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

        if user_profile.first_name:
            existing_user_profile.first_name = user_profile.first_name
        if user_profile.last_name is not None:
            existing_user_profile.last_name = user_profile.last_name
        if user_profile.bio is not None:
            existing_user_profile.bio = user_profile.bio

        db.commit()
        db.refresh(existing_user_profile)

      
        response_data = {
            "first_name": existing_user_profile.first_name,
            "last_name": existing_user_profile.last_name,
            "bio": existing_user_profile.bio
        }

        return response_data
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
