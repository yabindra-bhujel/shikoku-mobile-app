
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SchoolEventSchema(BaseModel):
    title: str
    description: Optional[str]
    event_date: datetime

class SchoolEventOutput(BaseModel):
    id: int
    title: str
    description: Optional[str]
    event_date: datetime
    created_at: datetime
    is_active: bool
    creator_id: int
    image: Optional[str]

class SchoolEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None