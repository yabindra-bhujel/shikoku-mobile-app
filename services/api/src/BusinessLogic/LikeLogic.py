from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.calender import *
from ..models.entity.users import User
from ..models.entity.likes import Likes
from ..models.entity.post import Post

class LikeLogic:

    @staticmethod
    def like(db: Session, user: User, post_id: int) -> Likes:
        try:
            # Check if the post exists
            post = db.query(Post).filter(Post.id == post_id).first()
            if not post:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
            
            # Check if the user already liked the post
            likes = db.query(Likes).filter(Likes.user_id == user.id, Likes.post_id == post_id).first()

            if likes:
                # Unlike the post (delete the like)
                db.delete(likes)
                db.commit()

                # Update the post's total_likes
                post.total_likes = max(0, post.total_likes - 1)  # Ensure total_likes doesn't go below 0
                db.commit()
                db.refresh(post)

                return likes
            else:
                # Like the post (create a new like)
                new_like = Likes(user_id=user.id, post_id=post_id, created_at=datetime.now(), is_active=True)
                db.add(new_like)
                db.commit()

                # Update the post's total_likes
                post.total_likes += 1
                db.commit()
                db.refresh(post)
                db.refresh(new_like)

                return new_like

        except Exception as e:
            db.rollback()  # Rollback in case of error to ensure DB integrity
            print(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
