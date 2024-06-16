import asyncio
import websockets
import requests


token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5YWJpIiwiaWQiOjIsImVtYWlsIjoieWFiaUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTcxNjM0ODU3Nn0.UMdcjqR8gff1_4NV4L2e3DtG_onPj7LDzbO3GNoEP-w"

headers = {
    "Authorization": f"Bearer {token}"
}



async def connect():
    uri = "ws://localhost:8000/ws"
    try:
        async with websockets.connect(uri, extra_headers=headers) as websocket:
            response = await websocket.recv()
            print(response)
    except websockets.exceptions.WebSocketException as e:
        print(e)

asyncio.get_event_loop().run_until_complete(connect())


# /ws/send_message

async def send_message():
    uri = "ws://localhost:8000/ws/send_message"
    try:
        async with websockets.connect(uri, extra_headers=headers) as websocket:
            response = await websocket.recv()
            print(response)
    except websockets.exceptions.WebSocketException as e:
        print(e)