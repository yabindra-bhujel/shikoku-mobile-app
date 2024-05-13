from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from jose import jwt
from ..settings.auth import AuthSettings
from ..models.entity import users
from sqlalchemy.exc import IntegrityError


class AuthLogic:
    def __init__(self):
        auth_settings = AuthSettings()
        self.pwd_context = auth_settings.passlib_context
        self.secret_key = auth_settings.SECRET_KEY
        self.algorithm = auth_settings.ALGORITHM

    def create_user(self, db: Session, data: dict) -> users.User:
        username = data['username']
        email = data['email']
        user = db.query(users.User).filter(users.User.username == username, users.User.email == email).first()
        if user:
            return None
        
        hashed_password = self.pwd_context.hash(data['password'])
        user = users.User(username=data['username'], email=data['email'], hashed_password=hashed_password)
        try:
            db.add(user)
            db.commit()
            db.refresh(user)
        except IntegrityError:
            return None
        return user

    def login_token(self, db: Session, username: str, password: str)->str:
        user = self.__authenticate_user(username, password, db)
        if user is None:
            return None
        token = self.__create_access_token(user.username, user.id, user.email, user.role, timedelta(minutes=15))
        return token
    
    def __authenticate_user(self, username: str, password: str, db)->users.User:
        user = db.query(users.User).filter(users.User.username == username).first()
        if not user or not self.pwd_context.verify(password, user.hashed_password):
            return None 
        return user
    
    def __create_access_token(self, username: str, user_id: int, email: str, role: str, expires_delta: timedelta)->str:
        encode = {'sub': username, 'id': user_id, 'email': email, 'role': role}
        expire = datetime.utcnow() + expires_delta
        encode.update({"exp": expire})
        token = jwt.encode(encode, self.secret_key, algorithm=self.algorithm)
        return token
    
    def current_user(self, token: str)->dict:
        payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        username = payload.get("sub")
        user_id = payload.get("id")
        email = payload.get("email")
        role = payload.get("role")
        if username is None or user_id is None or email is None or role is None:
            return None
        
        return {"username": username, "id": user_id, "email": email, "role": role}
    
    def logout(self, token: str):
        pass