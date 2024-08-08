from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from pydantic import BaseModel
from ..models.entity.application_settings import ApplicationSetting as SettingsModel

router = APIRouter(prefix="/settings", tags=["Settings"])
db_dependency = Depends(get_db)

class ApplicationSettings(BaseModel):
    user_id: int
    is_profile_searchable: bool
    is_message_notification_enabled: bool
    is_post_notification_enabled: bool
    is_survey_notification_enabled: bool
    is_two_factor_authentication_enabled: bool

@router.get("", status_code=status.HTTP_200_OK, response_model=ApplicationSettings)
async def get_application_settings(user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        user_settings = db.query(SettingsModel).filter(SettingsModel.user_id == user.id).first()
        return user_settings
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.put("", status_code=status.HTTP_200_OK, response_model=ApplicationSettings)
async def update_application_settings(settings: ApplicationSettings, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        user_settings = db.query(SettingsModel).filter(SettingsModel.user_id == user.id).first()
        user_settings.is_profile_searchable = settings.is_profile_searchable
        user_settings.is_message_notification_enabled = settings.is_message_notification_enabled
        user_settings.is_post_notification_enabled = settings.is_post_notification_enabled
        user_settings.is_survey_notification_enabled = settings.is_survey_notification_enabled
        user_settings.is_two_factor_authentication_enabled = settings.is_two_factor_authentication_enabled
        db.commit()
        return user_settings
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))