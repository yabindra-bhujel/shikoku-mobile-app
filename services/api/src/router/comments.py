from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
from fastapi_pagination import Page, Params
from ..schemas.comment import CommentInput, CommentRepliesInput, CommentReplyToReplySchema
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..BusinessLogic.CommentLogic import CommentLogic


router = APIRouter(prefix="/comments", tags=["Comment"])
db_dependency = Depends(get_db)


# DOTO: なんかスキマーがおかしいのでこれを修正する
class CommentSchma(BaseModel):
    id : int
    content : str
    created_at : datetime
    post_id : int
    user : dict = None
    username : str
    profile_picture : str
    replies : List[Dict] = None


@router.get("/{post_id}", response_model=Page[CommentSchma])
async def comment_list(
    request: Request, 
    post_id: int, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user),
    params: Params = Depends()
):
    try:
        comments = CommentLogic.get_comments(db, post_id, request, user)
        return comments
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CommentInput, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment = CommentLogic.create_comment(db, comment, user)

        return new_comment
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{comment_id}/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: int, post_id: int, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        CommentLogic.delete_comment(db, comment_id, user.id, post_id)
        return None
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/replies", status_code=status.HTTP_201_CREATED)
async def create_comment_reply(comment_reply: CommentRepliesInput, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment_reply = CommentLogic.create_comment_reply(db, comment_reply)

        return new_comment_reply
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.post("/replies/reply", status_code=status.HTTP_201_CREATED)
async def create_comment_reply_to_reply(comment_reply: CommentReplyToReplySchema, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        new_comment_reply = CommentLogic.create_comment_reply_to_reply(db, comment_reply, user)

        return new_comment_reply
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/replies/{comment_reply_id}/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment_reply(comment_reply_id: int, post_id: int, user: User = Depends(get_current_user), db: Session = db_dependency):
    try:
        CommentLogic.delete_comment_reply(db, comment_reply_id, user.id, post_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
