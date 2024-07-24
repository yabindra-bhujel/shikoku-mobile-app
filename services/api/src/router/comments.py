from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.comment import CommentInput, CommentRepliesInput
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..models.entity.comments import Comment, CommentReply

router = APIRouter(prefix="/comments", tags=["Comment"])

# Define the dependency for the database session
db_dependency = Depends(get_db)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CommentInput, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment = Comment(
            content=comment.content,
            user_id=user.id,
            post_id=comment.post_id,
            created_at=datetime.utcnow()
        )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: int, user: User = Depends(get_current_user), db: Session = db_dependency):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return None

@router.post("/replies", status_code=status.HTTP_201_CREATED)
async def create_comment_reply(comment_reply: CommentRepliesInput, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment_reply = CommentReply(
            content=comment_reply.content,
            user_id=comment_reply.user_id,
            post_id=comment_reply.post_id,
            parent_comment_id=comment_reply.comment_id,
            created_at=datetime.now(datetime.timezone.utc)
        )
        db.add(new_comment_reply)
        db.commit()
        db.refresh(new_comment_reply)
        return new_comment_reply
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/replies/{comment_reply_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment_reply(comment_reply_id: int, user: User = Depends(get_current_user), db: Session = db_dependency):
    comment_reply = db.query(CommentReply).filter(CommentReply.id == comment_reply_id).first()
    if comment_reply is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment Reply not found")
    db.delete(comment_reply)
    db.commit()
    return None
