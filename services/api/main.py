from fastapi import FastAPI,Depends, WebSocket, WebSocketDisconnect, HTTPException
from src.settings.auth import AuthSettings
from src.auth import router as auth_router
from src.auth.permissions import authenticate_user, get_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from src.router.calender import router as calender_router
import logging
from fastapi.responses import JSONResponse
from typing import Dict
from src.message.ConnectionManager import ConnectionManager
from src.message.PersonalMessage import PersonalMessage
from jose import JWTError, jwt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_settings = AuthSettings()


secret_key = auth_settings.SECRET_KEY
algorithm = auth_settings.ALGORITHM


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
app.include_router(calender_router)

@app.get("/")
async def root(user = Depends(authenticate_user)):
    return {"message": "Hello World"}

manager = ConnectionManager(logger=logger)
personal_message = PersonalMessage(app=app, connection_manager=manager)




@app.websocket("/ws")
async def websocket_connection(websocket: WebSocket):
    try:
        # auth_header = websocket.headers.get("Authorization")
        # if not auth_header:
        #     await websocket.close()
        #     return

        # token = auth_header.split("Bearer ")[1]
        # try:
        #     user = get_user(token=token)
        #     if user is None:
        #         await websocket.close()
        #         return
        # except JWTError as e:
        #     await websocket.close()
        #     return
        user = manager.logined_user(websocket=websocket)
        if user is None:
            await websocket.close()
            return
        manager.print_active_connections()

        if user:
            await manager.connect(websocket=websocket, username=user)

    except HTTPException as e:
        await websocket.close()
    except Exception as e:
        await websocket.close()

@app.websocket("/ws/send_message")
async def send_message(websocket: WebSocket):
    try:
        # auth_header = websocket.headers.get("Authorization")
        # if not auth_header:
        #     await websocket.close()
        #     return

        # token = auth_header.split("Bearer ")[1]
        # try:
        #     user = get_user(token=token)
        #     if user is None:
        #         await websocket.close()
        #         return
        # except JWTError as e:
        #     await websocket.close()
        #     return
        user = manager.logined_user(websocket=websocket)
        if user is None:
            await websocket.close()
            return

        if user:
            manager.get_user_from_socket(username=user)
            # await websocket.accept()
            data = await websocket.receive_text()
            print(data)

            # send message
            await websocket.send_text(data)

            
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        print(e)
