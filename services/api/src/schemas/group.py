from pydantic import BaseModel
from typing import Optional, List

class CreateGroupRequest(BaseModel):
    name: str
    description: Optional[str] = None
    group_type: Optional[str] = None
    member_list: Optional[List[int]] = None