from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from datetime import datetime
from ..auth.router import get_current_user
from ..models.entity.reminder import Reminder
from pydantic import BaseModel
from ..models.entity.users import User

router = APIRouter(prefix="/reminder",tags=["Reminder"])

db_dependency = Depends(get_db)

class ReminderInput(BaseModel):
    title: str
    description: str
    time_to_do: datetime
    time_to_remind: datetime

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_reminder(reminder: ReminderInput, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        reminder = Reminder(user_id=user.id,title=reminder.title,description=reminder.description,time_to_do=reminder.time_to_do,time_to_remind=reminder.time_to_remind)
        db.add(reminder)
        db.commit()
        db.refresh(reminder)
        return reminder
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("", status_code=status.HTTP_200_OK)
async def get_reminders(db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        reminders = db.query(Reminder).filter(Reminder.user_id == user.id).all()
        return reminders
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.put("/{reminder_id}", status_code=status.HTTP_200_OK)
async def update_reminder(reminder_id: int, reminder: ReminderInput, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
        if reminder is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
        reminder.title = reminder.title
        reminder.description = reminder.description
        reminder.time_to_do = reminder.time_to_do
        reminder.time_to_remind = reminder.time_to_remind
        db.commit()
        db.refresh(reminder)
        return reminder
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(reminder_id: int, db: Session = db_dependency, user: User = Depends(get_current_user)):

    try:
        reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
        if reminder.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to delete this reminder")
        
        if reminder is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
        db.delete(reminder)
        db.commit()
        return
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))