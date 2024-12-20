from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.database import get_db
from ..schemas.calender import *
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..schemas.like import LikeInput
from ..BusinessLogic.LikeLogic import LikeLogic

router = APIRouter(prefix="/likes", tags=["Like"])
db_dependency = Depends(get_db)

@router.post("", status_code=status.HTTP_201_CREATED)
async def like_toggle(like: LikeInput, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:

        like = LikeLogic.like(db, user, like.post_id)
        return like
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))