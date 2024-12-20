from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    ADMIN = 'admin'
    STAFF = 'staff'
    STUDENT = 'student'
    TEACHER = 'teacher'
    USER = 'user'
    
class Credentials(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str
    role: UserRole

class User(BaseModel):
    id : int
    username: str
    email: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChangePassword(BaseModel):
    username: str
    old_password: str
    new_password: str

class Login(BaseModel):
    username: str
    password: str
class UserSocket(BaseModel):
    username: str
    websocket: str

class RefreshTokenRequest(BaseModel):
    token: str = None

class Otp(BaseModel):
    password: str
    username: str
    otp: str
    
