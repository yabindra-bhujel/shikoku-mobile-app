from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..models.entity.notification_token import ExpoToken

router = APIRouter(prefix="/notification_token", tags=["Notification Token"])
db_dependency = Depends(get_db)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_notification_token(
        token: str = Form(...),
        db: Session = db_dependency,
        user: User = Depends(get_current_user)):
    try:
        notification_token = ExpoToken(token=token, user_id=user.id)
        db.add(notification_token)
        db.commit()

        return notification_token

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))