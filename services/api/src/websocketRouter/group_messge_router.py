from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import json
from typing import Annotated
from ..models.database import get_db
from ..BusinessLogic.messenging.Groups.ConnectionManager import ConnectionManager
from ..BusinessLogic.messenging.Groups.GroupMessageLogic import GroupMessageLogic

router = APIRouter(prefix="/ws", tags=["Group Message"])
db_dependency = Annotated[Session, Depends(get_db)]
manager = ConnectionManager()

@router.websocket("/{group_id}")
async def websocket_endpoint(websocket: WebSocket, group_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket, group_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # データベースの保存されて メセッジを返す 信頼性を高めるため
            database_message = GroupMessageLogic.saveMessage(db, message_data)

            # 送信されたデータに id と created_at を追加
            message_data["created_at"] = database_message.created_at.isoformat()
            message_data["id"] = database_message.id

            # メッセージを送信
            await manager.broadcast(message_data, group_id)

    except WebSocketDisconnect:
        # 何かしらの理由で websocket が切断された場合
        manager.disconnect(websocket, group_id)
    finally:
        # websocket が切断された場合
        manager.disconnect(websocket, group_id)

