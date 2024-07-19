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
        # グループIDがアクティブな接続に存在するか確認
        if group_id in self.active_connections:
            # グループからソケットを削除
            try:
                self.active_connections[group_id].remove(websocket)
                # グループ内の接続が空になった場合はグループを削除
                if not self.active_connections[group_id]:
                    del self.active_connections[group_id]
            except ValueError:
                # ソケットがリストに見つからない場合は無視
                pass
        else:
            pass


    # グループ ID に関連付けられたすべての接続にメッセージを送信
    async def broadcast(self, message: dict, group_id: int):
        message = json.dumps(message)
        for connection in self.active_connections.get(group_id, []):
            await connection.send_text(message) 
