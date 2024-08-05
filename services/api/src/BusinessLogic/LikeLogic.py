
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.calender import *
from ..models.entity.users import User
from ..models.entity.likes import Likes

class LikeLogic:

    @staticmethod
    def like(db: Session, user: User, post_id: int) -> Likes:
        try:
            likes = Likes(user_id=user.id, post_id=like.post_id, created_at=datetime.now(), is_active=True)
            db.add(likes)
            db.commit()
            db.refresh(likes)
            return likes
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    def dislike(db: Session, like_id: int) -> None:
        like = db.query(Likes).filter(Likes.id == like_id).first()
        if like is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")
        db.delete(like)
        db.commit()
        return None