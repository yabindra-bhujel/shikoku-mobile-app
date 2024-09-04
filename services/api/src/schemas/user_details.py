from pydantic import BaseModel
from typing import List, Optional


class SkillSchema(BaseModel):
    id: int
    name: str

class InterestSchema(BaseModel):
    id: int
    name: str

class ClubActivitySchema(BaseModel):
    id: int
    name: str

class UserInfo(BaseModel):
    user_id: int
    skills: Optional[List[SkillSchema]] = None
    interests: Optional[List[InterestSchema]] = None
    club_activities: Optional[List[ClubActivitySchema]] = None

