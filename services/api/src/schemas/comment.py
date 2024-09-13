from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class CommentInput(BaseModel):
    content: Optional[str] = None
    post_id: int

class CommentRepliesInput(BaseModel):
    content: Optional[str] = None
    comment_id: int
    user_id: int 
    post_id: int

class CommentReplyToReplySchema(BaseModel):
    content: Optional[str] = None
    comment_id: int
    parent_comment_id: int
    post_id: int

class UserSchema(BaseModel):
    username: str
    profile_picture: Optional[str] = None

class CommentSchma(BaseModel):
    id: int
    content: str
    created_at: datetime
    post_id: int
    user: UserSchema
    replies: List[Dict] = []