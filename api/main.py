from src.chatbot_message.ConnectionManager import ConnectionManager
from fastapi import FastAPI,Depends, WebSocket, WebSocketDisconnect
from src.auth import router as auth_router
from src.auth.permissions import authenticate_user, get_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import logging
from fastapi.responses import JSONResponse
from typing import Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access_token")


app.include_router(auth_router.router)

@app.get("/")
async def root(user = Depends(authenticate_user)):
    return {"message": "Hello World"}

manager = ConnectionManager(logger=logger)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # how to check header
    token= websocket.headers.get("Authorization")
    # token = token.split(" ")[1]

    user = get_user(token=token)
    print(user)

    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)