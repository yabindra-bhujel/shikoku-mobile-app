import asyncio
import websockets
import requests


token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWVlIiwiaWQiOjE3LCJlbWFpbCI6ImhlZWVAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTYxNzk1NTB9.9ZU-U9fbswjyw5Bbkes39nRAYx7gQMez43CY5Z8JcKo"
    
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
