from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Request
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.database import get_db, get_async_db
from ..models.entity.user_profile import UserProfile
from ..models.entity.users import User
from ..auth.router import get_current_user
import shutil
from ..schemas.user_profile import *
import os
from ..filters.UserFilter import UserFilter
from fastapi_pagination import  paginate, Page
from typing import Optional
from pydantic import BaseModel


# ユーザ プロファイル api の ルータ
router = APIRouter(prefix="/user_profile", tags=["User"])

# Dependency to get database session
db_dependency = Depends(get_db)
async_db_dependency = Depends(get_async_db)

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

class UserOutput(BaseModel):
    user_id: int
    username: str
    user_image: Optional[str] = None

@router.get("/group_create", response_model=Page[UserOutput], status_code=status.HTTP_200_OK)
async def get_users(
    request: Request,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(get_current_user),
    user_filter: UserFilter = Depends(UserFilter),
    page: int = 1,
    page_size: int = 50
):
    try:
        # クエリの作成
        query = select(User)

        # フィルタリング
        query = user_filter.filter_query(query)
        
        # ページネーションの適用
        query = query.limit(page_size).offset((page - 1) * page_size)
        
        # クエリの実行
        result = await db.execute(query)
        all_users = result.scalars().all()

        user_list = []
        for user in all_users:
            # ユーザープロファイルの取得
            user_profile_query = select(UserProfile).where(UserProfile.user_id == user.id)
            user_profile_result = await db.execute(user_profile_query)
            user_profile = user_profile_result.scalars().first()

            # ユーザの last name と first name を取得
            if user_profile:
                first_name = user_profile.first_name or ""
                last_name = user_profile.last_name or ""
                username = f"{first_name} {last_name}".strip()
            else:
                username = user.username

            user_data = {
                "user_id": user.id,
                "username": username
            }

            if user_profile and user_profile.profile_picture:
                user_data["user_image"] = str(request.url_for('static', path=user_profile.profile_picture))
            
            user_list.append(user_data)
        
        # ページネーションの適用
        return paginate(user_list)
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))