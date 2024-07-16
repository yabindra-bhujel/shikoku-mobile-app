from fastapi import WebSocket
from typing import List, Dict
import json

class ConnectionManager:
    def __init__(self, logger):
        # グループ ID と接続のリストを追跡するための辞書
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.logger = logger
    
    # ソケットをグループに接続
    async def connect(self, websocket: WebSocket, group_id: int):
        await websocket.accept()

        if group_id not in self.active_connections:
            self.active_connections[group_id] = []
            # ソケットをグループに追加　
        self.active_connections[group_id].append(websocket)

    # ユーザーが接続を切断したときに呼び出される
    def disconnect(self, websocket: WebSocket, group_id: int):
        # グループからソケットを削除
        self.active_connections[group_id].remove(websocket)
        if not self.active_connections[group_id]:
            del self.active_connections[group_id]

    # グループ ID に関連付けられたすべての接続にメッセージを送信
    async def broadcast(self, message: dict, group_id: int):
        message = json.dumps(message)
        for connection in self.active_connections.get(group_id, []):
            await connection.send_text(message) 
