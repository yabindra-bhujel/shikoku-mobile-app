from fastapi import FastAPI,Depends
from src.auth import router as auth_router
from src.auth.permissions import authenticate_user

app = FastAPI()
app.include_router(auth_router.router)

@app.get("/")
async def root(user = Depends(authenticate_user)):
    print(user)
    return {"message": "Hello World"}

