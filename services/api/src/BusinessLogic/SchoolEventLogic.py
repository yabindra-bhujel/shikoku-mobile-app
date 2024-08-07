from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.entity.users import User
from ..schemas.calender import *
from ..schemas.school_event import SchoolEventSchema, SchoolEventOutput, SchoolEventUpdate
from ..models.entity.school_event import SchoolEvent as SchoolEventModel
from fastapi_pagination.ext.sqlalchemy import paginate

class SchoolEventLogic:
    
    @staticmethod
    def create(db: Session, event: SchoolEventSchema, user: User) -> SchoolEventOutput:
        try:
            school_event = SchoolEventModel(
                title=event.title,
                description=event.description,
                event_date=event.event_date,
                creator_id=user.id,
                created_at=datetime.now()
            )
            db.add(school_event)
            db.commit()
            db.refresh(school_event)

            return school_event

        except ValueError as e:
            raise e
        
    @staticmethod
    def get_events(db: Session) -> SchoolEventOutput:
        query = db.query(SchoolEventModel).filter(
            SchoolEventModel.is_active == True,
            SchoolEventModel.event_date >= datetime.now()
        ).order_by(SchoolEventModel.event_date.desc())
    
        events = paginate(db, query)

        return events
    
    @staticmethod
    def get_event(db: Session, event_id: int) -> SchoolEventOutput:
        event = db.query(SchoolEventModel).filter(
            SchoolEventModel.id == event_id,
            SchoolEventModel.is_active == True
        ).first()

        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Event not found")
        
        return event
    
    @staticmethod
    def update(db: Session, event_id: int, event: SchoolEventUpdate, user: User) -> SchoolEventOutput:
        
        school_event = db.query(SchoolEventModel).filter(SchoolEventModel.id == event_id).first()
        if not school_event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        
        if school_event.creator_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to update this event")
        
        if event.title is not None:
            school_event.title = event.title
        if event.description is not None:
            school_event.description = event.description
        if event.event_date is not None:
            school_event.event_date = event.event_date

        db.commit()
        db.refresh(school_event)
        
        return school_event
    
    @staticmethod
    def delete(db: Session, event_id: int, user: User) -> None:
        """
        物理削除ではなく、is_activeをFalseにする
        """
        event = db.query(SchoolEventModel).filter(SchoolEventModel.id == event_id).first()
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        
        if event.creator_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to delete this event")
        
        event.is_active = False
        db.commit()
        return None


    