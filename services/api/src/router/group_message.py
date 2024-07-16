from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..BusinessLogic.messenging.Groups.GroupMessageLogic import GroupMessageLogic
from ..schemas.GroupMessageSchema import GroupMessageSchema
from typing import List

router = APIRouter(prefix="/group_messages", tags=["Group Message"])

# データベースセッションの依存関係を定義
db_dependency = Depends(get_db)

# メッセージのfetch
@router.get("/{group_id}", response_model=List[GroupMessageSchema])
async def get_group_messages(group_id: int, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        messages = GroupMessageLogic.getMessages(db, group_id)
        return messages
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# メセッジを削除する
@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group_message(message_id: int, db: Session = db_dependency, user: User = Depends(get_current_user)):
    try:
        GroupMessageLogic.deleteMessage(db, message_id, user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return None

