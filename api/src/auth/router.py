from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from .logic import AuthLogic
from .schema import *

router = APIRouter(prefix="/auth",tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access_token")
db_dependency = Annotated[Session, Depends(get_db)]
auth_logic = AuthLogic()

@router.post("/create_user", status_code=status.HTTP_201_CREATED,
             description="Create a new user with the provided credentials. Returns HTTP 400 if user already exists.The role field should be one of 'admin', 'staff', 'student', 'teacher', or 'user'.")
async def create_user(db: db_dependency, credentials: Credentials):

    user = auth_logic.create_user(db, credentials.dict())
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    return {"message": "User created successfully"}

@router.post("/access_token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends(OAuth2PasswordRequestForm)], db: db_dependency):
    user = auth_logic.login_token(db, form_data.username, form_data.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    return {"access_token": user, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user = auth_logic.current_user(token)
        if user is None or not all(key in user for key in ['username', 'email', 'role']):
            raise credentials_exception
        return User(**user)
    except JWTError:
        raise credentials_exception

@router.get("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(token: str = Depends(oauth2_scheme)):
    auth_logic.logout(token)
    return None

@router.post("/chnage_password", status_code=status.HTTP_200_OK)
async def change_password(db: db_dependency, credentials: ChangePassword, user: User = Depends(get_current_user)):
    password_changed = auth_logic.chnage_password(db, user.username, credentials.old_password, credentials.new_password)
    if password_changed is  None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")
    
    return {"message": "Password changed successfully"}




