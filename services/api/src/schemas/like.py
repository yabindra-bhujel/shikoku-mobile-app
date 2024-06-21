from pydantic import BaseModel

class LikeInput(BaseModel):
    user_id: int
    post_id: int