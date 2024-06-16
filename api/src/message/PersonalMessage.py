from fastapi import WebSocket
from sqlalchemy.orm import Session
from fastapi import FastAPI
from typing import Dict, Optional
from .ConnectionManager import ConnectionManager

class PersonalMessage:
    def __init__(self, app: FastAPI, connection_manager:ConnectionManager) -> None:
        self.app = app
        self.manager = connection_manager
    

    def send_message(self, sender: str, receiver: str, message: str) -> None:

        try:
            sender_socket_id = self._get_socket_id(username=sender)
            receiver_socket_id = self._get_socket_id(username=receiver)

            if sender_socket_id and receiver_socket_id:
                self._send_message({
                    "sender": sender_socket_id,
                    "receiver": receiver_socket_id,
                    "message": message
                })
                self._save_message(message=message)
            else:
                self._save_message(message=message)
        except Exception as e:
            raise e

    def _get_socket_id(self, username: str) -> str:
        return self.manager.get_user_from_socket(username=username)

    def _save_message(self, message: str) -> None:
        pass

    def _send_message(self, message: Dict) -> None:
        pass
