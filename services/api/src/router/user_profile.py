from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Request
from sqlalchemy.orm import Session
from fastapi_pagination import  Page,Params
from sqlalchemy import func
from fastapi_pagination.ext.sqlalchemy import paginate
from ..models.database import get_db, get_async_db
from ..models.entity.user_profile import UserProfile
from ..models.entity.users import User
from ..auth.router import get_current_user
from ..schemas.user_profile import *
from ..filters.UserFilter import UserFilter
from ..BusinessLogic.UserProfileLogic import UserProfileLogic
from ..models.entity.application_settings import ApplicationSetting

# ユーザ プロファイル api の ルータ
router = APIRouter(prefix="/user_profile", tags=["User"])

# Dependency to get database session
db_dependency = Depends(get_db)
async_db_dependency = Depends(get_async_db)

# ユーザ プロファイルの作成
@router.post("", status_code=status.HTTP_201_CREATED, response_model=UserProfileOutput)
async def create_user(user_profile: UserProfileInput, request: Request, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        new_user_profile = UserProfileLogic.create(db, user, user_profile.first_name,
                                                    user_profile.last_name, user_profile.bio)
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
        UserProfileLogic.profile(db, user, file, request)
        return {"message": "Profile picture uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error: {str(e)}")


# ユーザ プロファイルの取得
@router.get("", status_code=status.HTTP_200_OK)
async def get_profile(request: Request, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        user_profile = UserProfileLogic.get_profile(db, user, request)

        return user_profile
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# ユーザ プロファイルの更新
@router.put("", status_code=status.HTTP_200_OK, response_model=UserProfileOutput)
async def update_profile(user_profile: UserProfileInput, request: Request, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        response_data = UserProfileLogic.update(db, user, user_profile, request)

        return response_data
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/group_create")
async def get_users(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    user_filter: UserFilter = Depends(UserFilter),
    params: Params = Depends(Params)
)->Page[UserOutput]:
    try:
        query = (db.query(
            User.id.label('user_id'),
            func.concat(UserProfile.first_name, ' ', UserProfile.last_name).label('username'),
            UserProfile.profile_picture.label('user_image'))
            .join(UserProfile, User.id == UserProfile.user_id)
            .join(ApplicationSetting, User.id == ApplicationSetting.user_id)
            .filter(ApplicationSetting.is_profile_searchable == True)
            .order_by(User.id.desc())
        )

        # フィルタリング
        query = user_filter.filter_query(query)
        users = paginate(db, query)

        # ユーザの画像の URL を作成
        for user in users.items:
            if user.user_image:
                user.user_image = str(request.url_for('static', path=user.user_image))

        return users
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))