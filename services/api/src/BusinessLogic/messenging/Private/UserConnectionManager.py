from fastapi import WebSocket
from typing import List, Dict
import json

class UserConnectionManager:

    def __init__(self, logger):
        self.active_users: Dict[int, List[WebSocket]]
        self.logger = logger

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()

        if user_id not in self.active_users:
            self.active_users[user_id] = []
        self.active_users[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        self.active_users[user_id].remove(websocket)
        if not self.active_users[user_id]:
            del self.active_users[user_id]

    async def broadcast(self, message: dict, user_id: int):
        message = json.dumps(message)
        for connection in self.active_users.get(user_id, []):
            await connection.send_text(message)