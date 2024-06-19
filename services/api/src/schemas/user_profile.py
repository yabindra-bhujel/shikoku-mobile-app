from typing import Optional
from pydantic import BaseModel

class UserProfileInput(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None

class UserProfileOutput(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
