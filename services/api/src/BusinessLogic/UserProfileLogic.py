from urllib.request import Request
from fastapi import HTTPException, status
import os
import shutil
from sqlalchemy.orm import Session
from ..models.entity.users import User
from ..schemas.user_profile import UserProfileInput
from ..models.entity.user_profile import UserProfile

class UserProfileLogic:
    
    @staticmethod
    def create(db: Session, user: User,
                first_name: str, last_name: str, bio: str) -> UserProfile:
        try:
            user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
            if user_profile:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User profile already exists")
            
            new_user_profile = UserProfile(
                first_name=first_name,
                last_name=last_name,
                bio=bio,
                user_id=user.id
            )

            # データベースに保存
            db.add(new_user_profile)
            db.commit()
            db.refresh(new_user_profile)

            return new_user_profile
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        

    @staticmethod
    def profile(db, user: User, file: bytes, request: Request) -> UserProfile:
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

            profile_picture_url = request.url_for('static', path=user_profile.profile_picture)

            return {"message": "Profile picture uploaded successfully", "profile_picture_url": profile_picture_url}
        
        except Exception as e:
            # エラーが 発生したら 元のデータに戻す
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    def get_profile(db: Session, user: User, request: Request) -> dict:
        try:
            user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
            if not user_profile:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
            
            user = db.query(User).filter(User.id == user_profile.user_id).first()
            
            profile_output = {
                "id": user.username,
                "user_id": user.id,
                "first_name": user_profile.first_name,
                "last_name": user_profile.last_name,
                "bio": user_profile.bio,
                "update_profile": None,
                "department": user.department,

            }

            if user_profile.profile_picture:
                profile_output["image"] = str(request.url_for('static', path=user_profile.profile_picture))
        
            return profile_output
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    def update(db: Session, user: User, user_profile: UserProfileInput, request: Request) -> dict:
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