from jose import jwt
from jose.exceptions import JWTError
from fastapi.exceptions import HTTPException
from fastapi import Depends, Request
from ..settings.auth import AuthSettings
from .schema import *

class AuthenticationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=401, detail=detail)

class AuthorizationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=403, detail=detail)

auth_settings = AuthSettings()
secret_key = auth_settings.SECRET_KEY
algorithm = auth_settings.ALGORITHM
http_exception = AuthenticationError("Invalid credentials")
role_exception = AuthorizationError("Invalid role")

def authenticate_user(request: Request) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise http_exception
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        user = get_user_model(payload)
        if user is None:
            raise http_exception
        return user
    except JWTError:
        raise http_exception

def authenticate_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise http_exception
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        if payload['role'] != 'admin':
            raise role_exception
        user = get_user_model(payload)
        if user is None:
            raise http_exception
        return user
    except JWTError:
        raise http_exception

def authenticate_staff(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise http_exception
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        if payload['role'] != 'staff':
            raise role_exception
        user = get_user_model(payload)
        if user is None:
            raise http_exception
        return user
    except JWTError:
        raise http_exception

def authenticate_teacher(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise http_exception
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        if payload['role'] != 'teacher':
            raise role_exception
        user = get_user_model(payload)
        if user is None:
            raise http_exception
        return user
    except JWTError:
        raise http_exception

def authenticate_student(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise http_exception
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        if payload['role'] != 'student':
            raise role_exception
        user = get_user_model(payload)
        if user is None:
            raise http_exception
        return user
    except JWTError:
        raise http_exception

def get_user_model(payload: dict):
    username = payload.get("sub")
    id = payload.get("id")
    email = payload.get("email")
    role = payload.get("role")
    if username is None or id is None or email is None or role is None:
        return None
    usermodel = User(id=id, username=username, email=email, role=role)
    return usermodel
