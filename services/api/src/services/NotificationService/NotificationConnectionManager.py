from fastapi import WebSocket
from typing import Dict

class NotificationConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, username: str) -> None:
        """Handle WebSocket connection events."""
        await websocket.accept()
        if username not in self.active_connections:
            self.active_connections[username] = []
            # ソケットをユーザーに追加
        self.active_connections[username] = websocket
        self.logger.info(f"WebSocket connected: {websocket.client}")

    def disconnect(self, websocket: WebSocket, username: str) -> None:
        """Handle WebSocket disconnection events."""
        if username in self.active_connections:
            try:
                self.active_connections[username].remove(websocket)
                self.logger.info(f"WebSocket disconnected: {websocket.client}")
            except ValueError:
                pass
        else:
            self.logger.info(f"WebSocket disconnected: {websocket.client}")

    def get_socket(self, username: list) -> WebSocket:
        """Get the WebSocket for a username."""
        return self.active_connections[username]

    async def send_notification(self, username: str, data: Dict[str, str]) -> None:
        """Send a notification to a user."""
        if username in self.active_connections:
            await self.active_connections[username].send_json(data)