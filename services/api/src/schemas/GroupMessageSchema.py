from pydantic import BaseModel
from datetime import datetime

class GroupMessageSchema(BaseModel):
    id: int
    group_id: int
    sender_id: int
    message: str
    created_at: datetime