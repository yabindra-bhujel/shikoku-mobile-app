from pydantic import BaseModel, EmailStr

class Credentials(BaseModel):
    username: str
    email: EmailStr
    password: str

class User(BaseModel):
    id : int
    username: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str