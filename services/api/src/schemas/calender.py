from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum

class CalendarOutput(BaseModel):
    id: int
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    color: str
    is_active: bool
    user_id: int

class CalendarInput(BaseModel):
    title: str
    description: str
    start: datetime
    end: datetime
    color: str
    user_id: int

class CalendarUpdate(BaseModel):
    title: str = None
    description: str = None
    start: str = None
    end: str = None
    color: str = None
