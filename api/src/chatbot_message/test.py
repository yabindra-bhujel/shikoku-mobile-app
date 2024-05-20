import asyncio
import websockets

async def connect():
    uri = "ws://localhost:8000/ws"
    try:
        async with websockets.connect(uri) as websocket:
            response = await websocket.recv()
            print(response)
    except Exception as e:
        print(e)

asyncio.get_event_loop().run_until_complete(connect())
