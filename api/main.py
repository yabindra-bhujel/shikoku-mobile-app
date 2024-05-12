from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.auth import router as auth_router
from src.auth.router import get_current_user
from src.models.database import SessionLocal, engine, Base
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt

app = FastAPI()

# Create all database tables
Base.metadata.create_all(bind=engine)

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

app.include_router(auth_router.router)



@app.get("/", response_model=dict, status_code=status.HTTP_200_OK)
async def get_user_info(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return {"user": user}
