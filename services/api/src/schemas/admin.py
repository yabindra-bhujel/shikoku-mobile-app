from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    image_url: Optional[str] = None
    department: Optional[str] = None
    joined_at: datetime
    role: Optional[str] = None

    class Config:
        orm_mode = True
    
class UserInput(BaseModel):
    id: str
    email: EmailStr
    firstName: str
    lastName: str
    internationalStudent: bool
    role: str
    department: str = None