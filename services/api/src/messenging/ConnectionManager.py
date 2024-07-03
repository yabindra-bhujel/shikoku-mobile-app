from fastapi import WebSocket
from typing import List

class ConnectionManager:
    def __init__(self, logger):
        self.active_connections :List[WebSocket] = []
        self.logger = logger
    
    async def connect(self, websocket: WebSocket):
        """connect event"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.logger.info(f"WebSocket connected: {websocket.client}")

    
    def disconnect(self, websocket: WebSocket):
        """disconnect event"""
        self.active_connections.remove(websocket)
        self.logger.info(f"WebSocket disconnected: {websocket.client}")