from pydantic import BaseModel

class LikeInput(BaseModel):
    post_id: int