from typing import Optional
from pydantic import BaseModel

class UserOutput(BaseModel):
    user_id: int
    username: str
    user_image: Optional[str] = None
    
class UserProfileInput(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None

class UserProfileOutput(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
