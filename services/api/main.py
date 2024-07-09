from fastapi import FastAPI,Depends, WebSocket, WebSocketDisconnect, HTTPException
from src.settings.auth import AuthSettings
from src.auth import router as auth_router
from src.auth.permissions import authenticate_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from src.router.calender import router as calender_router
from src.router.user_profile import router as user_profile_router
import logging
import os
from fastapi.staticfiles import StaticFiles
from src.router.posts import router as post_router
from src.router.comments import router as comment_router
from src.router.likes import router as like_router
import logging
from debug_toolbar.middleware import DebugToolbarMiddleware
from src.router.group import router as group_router
from src.messenging.ConnectionManager import ConnectionManager
from fastapi.responses import HTMLResponse
from src.models.database import get_db
from sqlalchemy.orm import Session
from src.messenging.GroupMessage import GroupMessage
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_settings = AuthSettings()


secret_key = auth_settings.SECRET_KEY
algorithm = auth_settings.ALGORITHM


app = FastAPI(debug=True)
app.add_middleware(DebugToolbarMiddleware, panels=["debug_toolbar.panels.timer.TimerPanel"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access_token")

app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")


# api の router を登録
app.include_router(auth_router.router)
app.include_router(calender_router)
app.include_router(user_profile_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)
app.include_router(group_router)




html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws/1");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


manager = ConnectionManager(logger=logger)


@app.websocket("/ws/{group_id}")
async def websocket_endpoint(websocket: WebSocket, group_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket, group_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)

            # JSON形式でデコード
            message_data = json.loads(data)

            await manager.broadcast(f"Client #{group_id} says: {message_data['message']}", group_id)

            # メッセージをデータベースに保存
            # if not message_data.get("message") or not message_data.get("sender_fullname") or not message_data.get("group_id") or not message_data.get("sender_id"):
            #     continue
            try:

                GroupMessage.saveMessage(db, message_data)
            except ValueError as e:
                await websocket.send_text(f"Error: {e}")

    except WebSocketDisconnect:
        manager.disconnect(websocket, group_id)
        await manager.broadcast(f"Client #{group_id} left the chat", group_id)

