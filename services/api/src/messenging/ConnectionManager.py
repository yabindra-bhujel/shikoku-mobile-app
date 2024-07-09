from fastapi import WebSocket
from typing import List, Dict

class ConnectionManager:
    def __init__(self, logger):
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.logger = logger
    
    async def connect(self, websocket: WebSocket, group_id: int):
        await websocket.accept()
        if group_id not in self.active_connections:
            self.active_connections[group_id] = []
        self.active_connections[group_id].append(websocket)

    def disconnect(self, websocket: WebSocket, group_id: int):
        self.active_connections[group_id].remove(websocket)
        if not self.active_connections[group_id]:
            del self.active_connections[group_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, group_id: int):
        for connection in self.active_connections.get(group_id, []):
            await connection.send_text(message)