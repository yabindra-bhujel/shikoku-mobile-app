from fastapi import WebSocket
from typing import Dict, Optional
from ..auth.schema import UserSocket
from ..auth.permissions import get_user
from jose import JWTError

class ConnectionManager:
    def __init__(self, logger):
        self.active_connections: Dict[str, WebSocket] = {}
        self.logger = logger
    
    async def connect(self, websocket: WebSocket, username: str) -> None:
        """Handle WebSocket connection events."""
        await websocket.accept()
        self.active_connections[username] = websocket
        self.logger.info(f"WebSocket connected: {websocket.client}")

    def disconnect(self, websocket: WebSocket) -> None:
        """Handle WebSocket disconnection events."""
        for username, socket in list(self.active_connections.items()):
            if socket == websocket:
                del self.active_connections[username]
                self.logger.info(f"WebSocket disconnected: {websocket.client}")
                break

    def get_user_from_socket(self, username: str) -> Optional[UserSocket]:
        """Get user socket."""
        if username in self.active_connections:
            # user =  UserSocket(username=username, websocket=self.active_connections[username])
            # return socker id
            return self.active_connections[username]
        
        return None

    def get_all_active_connections(self) -> Dict[str, WebSocket]:
        """Get all active WebSocket connections."""
        return {username: user_connection.websocket for username, user_connection in self.active_connections.items()}
    
    def print_active_connections(self) -> None:
        for username, websocket in self.active_connections.items():
            print(f"Username: {username}, WebSocket: {id(websocket)}")

    def logined_user(self, websocket: WebSocket ) -> str:
        try:
            auth_header = websocket.headers.get("Authorization")
            if not auth_header:
                return None
            
            token = auth_header.split("Bearer ")[1]
            try:
                user = get_user(token=token)
                if user is None:
                    return None
            except JWTError as e:
                return None
            return user.username
        except Exception as e:
            return None

    


