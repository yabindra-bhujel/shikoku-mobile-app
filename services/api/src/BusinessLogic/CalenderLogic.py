from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models.entity.calender import Calendar
from datetime import datetime
from typing import List
from ..models.entity.users import User
from ..schemas.calender import *


class CalenderLogic:

    @staticmethod
    def create_calender(db: Session, calendar: CalendarInput, user: User) -> Calendar:
        try:
            new_calendar = Calendar(
                title=calendar.title,
                description=calendar.description,
                start_time=calendar.start,
                end_time=calendar.end,
                is_active=True,
                color=calendar.color,
                created_at=datetime.utcnow(),
                user_id=user.id,
            )
            db.add(new_calendar)
            db.commit()
            db.refresh(new_calendar)
            return new_calendar

        except Exception as e:
            raise e

    @staticmethod
    def get_calendars(db: Session, user: User) -> List[CalendarOutput]:
        calendars = db.query(Calendar).filter(Calendar.user_id == user.id).all()
        return calendars

    @staticmethod
    def get_calendar(db: Session, id: int, user: User) -> CalendarOutput:
        calendar = (
            db.query(Calendar)
            .filter(Calendar.id == id, Calendar.user_id == user.id)
            .first()
        )
        if calendar is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found"
            )
        return calendar

    @staticmethod
    def update_calendar(
        db: Session, id: int, calendar_data: CalendarUpdate, user: User
    ) -> CalendarOutput:
        try:
            calendar = (
                db.query(Calendar)
                .filter(Calendar.id == id, Calendar.user_id == user.id)
                .first()
            )
            if calendar is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found"
                )
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
            raise e

    @staticmethod
    def delete_calendar(db: Session, id: int, user: User) -> None:
        calendar = (
            db.query(Calendar)
            .filter(Calendar.id == id, Calendar.user_id == user.id)
            .first()
        )
        if calendar is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Calendar not found"
            )
        db.delete(calendar)
        db.commit()
