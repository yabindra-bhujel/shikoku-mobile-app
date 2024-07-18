from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..models.entity.likes import Likes
from ..schemas.like import LikeInput

router = APIRouter(prefix="/likes", tags=["Like"])
db_dependency = Depends(get_db)

@router.post("", status_code=status.HTTP_201_CREATED)
async def like_toggle(like: LikeInput, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        existing_like = db.query(Likes).filter(
            Likes.user_id == user.id,
            Likes.post_id == like.post_id
        ).first()

        if existing_like:
            db.delete(existing_like)
            db.commit()
            like.post.total_likes -= 1
            return {"message": "Like removed successfully"}
        else:
            new_like = Likes(
                user_id=user.id,
                post_id=like.post_id,
                created_at=datetime.now(),
                is_active=True
            )
            db.add(new_like)
            db.commit()
            db.refresh(new_like)
            like.post.total_likes += 1
            return new_like

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
