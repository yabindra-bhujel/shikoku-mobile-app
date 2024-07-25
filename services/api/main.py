import json
import os
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from src.auth import router as auth_router
from src.router.calender import router as calender_router
from src.router.user_profile import router as user_profile_router
from src.router.posts import router as post_router
from src.router.comments import router as comment_router
from src.router.likes import router as like_router
from src.router.group import router as group_router
from src.router.group_message import router as group_message_router
from src.models.database import get_db
from src.BusinessLogic.messenging.Groups.GroupMessageLogic import GroupMessageLogic
from src.BusinessLogic.messenging.Groups.ConnectionManager import ConnectionManager
from config.logging_config import setup_logging
from config.middlewares import LogRequestsMiddleware
from config.exception.exception import ExceptionHandlerMiddleware
from fastapi_pagination import add_pagination
from fastapi_pagination import add_pagination, Page, LimitOffsetPage

# 開発環境でのみ使用するため
from debug_toolbar.middleware import DebugToolbarMiddleware

# ログの設定
logger = setup_logging()

app = FastAPI(debug=True)
app.add_middleware(DebugToolbarMiddleware, panels=["debug_toolbar.panels.timer.TimerPanel"])

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ログミドルウェアの設定
app.add_middleware(LogRequestsMiddleware, logger=logger)


# ...

# ページネーションの設定
add_pagination(app)

# ...

# 例外ミドルウェアの設定
app.add_exception_handler(Exception, ExceptionHandlerMiddleware)

# 静的ファイルのディレクトリを登録
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

# apiのrouterを登録
app.include_router(auth_router.router)
app.include_router(calender_router)
app.include_router(user_profile_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)
app.include_router(group_router)
app.include_router(group_message_router)


#  これは テスト用の HTML です
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
            var ws = new WebSocket("ws://localhost:8000/ws/29");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
        function sendMessage(event) {
            var input = document.getElementById("messageText");
            var messageData = {
                message: input.value,
                sender_id: "12",
                group_id: "29"
            };
            ws.send(JSON.stringify(messageData));
            input.value = '';
            event.preventDefault();
        }
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)
# ここまで

# WebSocket のエンドポイント
manager = ConnectionManager(logger=logger)

@app.websocket("/ws/{group_id}")
async def websocket_endpoint(websocket: WebSocket, group_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket, group_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # データベースの保存されて メセッジを返す 信頼性を高めるため
            database_message = GroupMessageLogic.saveMessage(db, message_data)

            # 送信されたデータに id と created_at を追加
            message_data["created_at"] = database_message.created_at.isoformat()
            message_data["id"] = database_message.id

            # メッセージを送信
            await manager.broadcast(message_data, group_id)

    except WebSocketDisconnect:
        # 何かしらの理由で websocket が切断された場合
        manager.disconnect(websocket, group_id)
    finally:
        # websocket が切断された場合
        manager.disconnect(websocket, group_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
