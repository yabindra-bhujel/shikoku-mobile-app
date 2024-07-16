from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from fastapi.security import OAuth2PasswordBearer
from ..schemas.calender import *
from ..auth.router import get_current_user
from typing import List
from ..models.entity.users import User
from ..BusinessLogic.CalenderLogic import CalenderLogic

router = APIRouter(prefix="/calenders", tags=["calender"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access_token")
db_dependency = Annotated[Session, Depends(get_db)]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_calender(
    db: db_dependency, calendar: CalendarInput, user: User = Depends(get_current_user)
):
    try:
        new_calendar = CalenderLogic.create_calender(db, calendar, user)
        return new_calendar

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=List[CalendarOutput])
async def get_calendars(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        calendars = CalenderLogic.get_calendars(db, user)
        return calendars
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{id}", response_model=CalendarOutput)
async def get_calendar(
    id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        calendar = CalenderLogic.get_calendar(db, id, user)
        return calendar
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{id}", response_model=CalendarOutput)
async def update_calendar(
    id: int,
    calendar_data: CalendarUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        calendar = CalenderLogic.update_calendar(db, id, calendar_data, user)
        return calendar

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_calendar(
    id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        CalenderLogic.delete_calendar(db, id, user)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
