import asyncio
import websockets
import json

async def send_message():
    uri = "ws://localhost:8000/ws/send_message"


    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5YWJpIiwiaWQiOjIsImVtYWlsIjoieWFiaUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTcxNjM0ODU3Nn0.UMdcjqR8gff1_4NV4L2e3DtG_onPj7LDzbO3GNoEP-w"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        async with websockets.connect(uri, extra_headers=headers) as websocket:
            # Serialize data to JSON string
            data = {"receiver": "receiver_username", "message": "Hello, world!"}
            json_data = json.dumps(data)
            
            # Send JSON data to the server
            await websocket.send(json_data)
            
            # Receive response from the server
            response = await websocket.recv()
            print(response)
    except websockets.exceptions.WebSocketException as e:
        print(e)

# Run the event loop to start the WebSocket client
asyncio.get_event_loop().run_until_complete(send_message())
