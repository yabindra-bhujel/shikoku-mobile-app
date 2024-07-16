from pydantic import BaseModel
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
    image_urls: Optional[List[str]] = None
    video_urls: Optional[List[str]] = None
    file_urls: Optional[List[str]] = None
