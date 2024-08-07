from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi_pagination import Page, Params
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..schemas.school_event import *
from ..BusinessLogic.SchoolEventLogic import SchoolEventLogic

router = APIRouter(prefix="/school_event", tags=["School Event"])
db_dependency = Depends(get_db)

# TODO: Add image upload
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_school_event(
        event: SchoolEventSchema,
        # image: UploadFile = File(None),
        db: Session = db_dependency,
        user: User = Depends(get_current_user)):
    try:
        school_event = SchoolEventLogic.create(db, event, user)
        db.add(school_event)
        db.commit()
        db.refresh(school_event)

        return school_event

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/", response_model=Page[SchoolEventOutput])
async def get_school_events(
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db),
    params: Params = Depends()
):
    try:
        events = SchoolEventLogic.get_events(db)
        return events
    
    except ValueError as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{event_id}", response_model=SchoolEventOutput)
async def get_school_event(
    event_id: int, 
    db: Session = db_dependency, 
    user: User = Depends(get_current_user)):
    try:
        event = SchoolEventLogic.get_event(db, event_id)
        return event
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

# TODO: Add image update also
@router.patch("/{event_id}", response_model=SchoolEventOutput)
async def update_school_event(
    event_id: int, 
    event: SchoolEventUpdate, 
    db: Session = db_dependency, 
    user: User = Depends(get_current_user)):
    try:
        school_event = SchoolEventLogic.update(db, event_id, event, user)

        return school_event
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_school_event(
    event_id: int, 
    db: Session = db_dependency, 
    user: User = Depends(get_current_user)):
    try:
        SchoolEventLogic.delete(db, event_id, user)
        return None

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))