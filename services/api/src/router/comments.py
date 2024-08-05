from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas.comment import CommentInput, CommentRepliesInput
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..BusinessLogic.CommentLogic import CommentLogic

router = APIRouter(prefix="/comments", tags=["Comment"])

# Define the dependency for the database session
db_dependency = Depends(get_db)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CommentInput, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment = CommentLogic.create_comment(db, comment)

        return new_comment
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: int, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        CommentLogic.delete_comment(db, comment_id, user.id)
        return None
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/replies", status_code=status.HTTP_201_CREATED)
async def create_comment_reply(comment_reply: CommentRepliesInput, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment_reply = CommentLogic.create_comment_reply(db, comment_reply)

        return new_comment_reply
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/replies/{comment_reply_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment_reply(comment_reply_id: int, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        CommentLogic.delete_comment_reply(db, comment_reply_id, user.id)
        return None
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
