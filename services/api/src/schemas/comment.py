from pydantic import BaseModel
from typing import Optional

class CommentInput(BaseModel):
    content: Optional[str] = None
    post_id: int
    user_id: int

class CommentRepliesInput(BaseModel):
    content: Optional[str] = None
    comment_id: int
    user_id: int 
    post_id: int