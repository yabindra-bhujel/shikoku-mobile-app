from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..messenging.GroupMessage import GroupMessage as GroupMessageLogic


router = APIRouter(prefix="/group_messages", tags=["Group Message"])

# データベースセッションの依存関係を定義
db_dependency = Depends(get_db)

@router.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_group_messages(group_id: int, db: Session = db_dependency, user: User = Depends(get_current_user)):
    messages = GroupMessageLogic.getMessages(db, group_id)
    return messages

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group_message(message_id: int, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        GroupMessageLogic.deleteMessage(db, message_id, user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return None

