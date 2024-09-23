from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Page, Params
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..models.entity.notification import Notification, NotificationRead, user_notifications

router = APIRouter(prefix="/notification", tags=["Notification"])
db_dependency = Depends(get_db)

class NotificationSchema(BaseModel):
    id: int
    notification_type: str
    title: str
    message: str
    created_at: datetime
    possible_url: str
    is_read: bool
    notification_read_id: int

    class Config:
        orm_mode = True

@router.get("", status_code=status.HTTP_200_OK, response_model=Page[NotificationSchema])
async def get_notifications(
        db: Session = db_dependency,
        user: User = Depends(get_current_user),
        params: Params = Depends()
        ):
    try:
        notifications_query = (
            db.query(Notification.id, 
                      Notification.notification_type,
                      Notification.title,
                      Notification.message,
                      Notification.created_at,
                      Notification.possible_url,
                      NotificationRead.is_read,
                      NotificationRead.id.label("notification_read_id"))
            .join(user_notifications)
            .join(NotificationRead)
            .filter(NotificationRead.user_id == user.id)
            .filter(user_notifications.c.user_id == user.id)
            .order_by(Notification.created_at.desc())
        )

        paginated_notifications = paginate(notifications_query, params)

        return paginated_notifications

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

@router.put("/read/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def mark_notification_as_read(notification_id: int, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        notification = db.query(NotificationRead).filter(NotificationRead.id == notification_id).first()
        if notification is None:
            raise ValueError("Notification not found")
        if notification.user_id != user.id:
            raise ValueError("Notification not found")
        notification.is_read = True
        db.add(notification)
        db.commit()

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return None
