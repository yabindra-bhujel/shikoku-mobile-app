from fastapi import FastAPI,Depends
from src.auth import router as auth_router
from src.auth.permissions import authenticate_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

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

