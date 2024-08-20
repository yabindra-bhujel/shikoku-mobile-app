from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
from typing import List

class PostOutput(BaseModel):
    id: int
    user_id: int
    content: Optional[str] = None
    is_active: bool
    image_urls: Optional[List[str]] = None
    video_urls: Optional[List[str]] = None
    file_urls: Optional[List[str]] = None
    created_at: datetime

class PostInput(BaseModel):
    content: Optional[str] = None
    image_files: Optional[List[str]] = None


# Pydantic モデル
class UserProfileSchama(BaseModel):
    id: int
    first_name: str
    last_name: str
    profile_picture: HttpUrl

class PostImage(BaseModel):
    url: str

# class PostData(BaseModel):
#     id: int
#     content: Optional[str]
#     created_at: datetime
#     user: UserProfileSchama
#     is_active: bool
#     total_comments: int
#     total_likes: int
#     is_liked: bool
#     images: Optional[List[str]] = None