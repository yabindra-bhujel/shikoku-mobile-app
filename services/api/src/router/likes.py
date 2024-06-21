from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from datetime import datetime
from ..schemas.calender import *
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..models.entity.likes import Likes
from ..schemas.like import LikeInput

router = APIRouter(prefix="/likes",tags=["Like"])

db_dependency = Depends(get_db)

@router.post("", status_code=status.HTTP_201_CREATED)
async def like(like: LikeInput, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        likes = Likes(user_id=user.id,post_id=like.post_id,created_at=datetime.now(),is_active=True)
        db.add(likes)
        db.commit()
        db.refresh(likes)
        return likes
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{like_id}", status_code=status.HTTP_204_NO_CONTENT)
async def dishlike(likeID: int, db: Session = db_dependency, user: User = Depends(get_current_user)):
    like = db.query(Likes).filter(Likes.id == likeID).first()
    if like is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")
    db.delete(like)
    db.commit()
    return None