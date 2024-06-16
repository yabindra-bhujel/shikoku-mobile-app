from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..models.entity.calender import Calendar
from datetime import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from ..schemas.calender import *
from ..auth.router import get_current_user
from ..auth.permissions import authenticate_user
from ..auth.logic import AuthLogic
from typing import List
from ..models.entity.users import User


router = APIRouter(prefix="/calenders",tags=["calender"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access_token")
db_dependency = Annotated[Session, Depends(get_db)]
auth_logic = AuthLogic()

@router.post("", status_code=status.HTTP_201_CREATED)
async def change_password(db: db_dependency, calendar: CalendarInput, user: User = Depends(get_current_user)):
    try:
        new_calendar = Calendar(
            title=calendar.title,
            description=calendar.description,
            start_time=calendar.start,  
            end_time=calendar.end,  
            is_active=True,
            color=calendar.color,
            created_at=datetime.utcnow(),
            user_id=user.id
        )
        db.add(new_calendar)
        db.commit()
        db.refresh(new_calendar)
        return new_calendar
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("", response_model=List[CalendarOutput])
async def get_calendars(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    calendars = db.query(Calendar).filter(Calendar.user_id == user.id).all()
    return calendars


@router.get("/{id}", response_model=CalendarOutput)
async def get_calendar(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    calendar = db.query(Calendar).filter(Calendar.id == id, Calendar.user_id == user.id).first()
    if calendar is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found")
    return calendar

@router.put("/{id}", response_model=CalendarOutput)
async def update_calendar(id: int, calendar_data: CalendarUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        calendar = db.query(Calendar).filter(Calendar.id == id, Calendar.user_id == user.id).first()
        if calendar is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found")
        if calendar_data.title is not None:
            calendar.title = calendar_data.title
        if calendar_data.description is not None:
            calendar.description = calendar_data.description
        if calendar_data.start is not None:
            calendar.start_time = calendar_data.start
        if calendar_data.end is not None:
            calendar.end_time = calendar_data.end
        if calendar_data.color is not None:
            calendar.color = calendar_data.color
        
        db.commit()
        db.refresh(calendar)
        return calendar
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_calendar(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    calendar = db.query(Calendar).filter(Calendar.id == id, Calendar.user_id == user.id).first()
    if calendar is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found")
    db.delete(calendar)
    db.commit()
    return None