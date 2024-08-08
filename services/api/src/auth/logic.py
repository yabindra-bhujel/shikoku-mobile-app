from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from jose import jwt
from ..settings.auth import AuthSettings
from ..models.entity import users
from ..models.entity.user_profile import UserProfile
from sqlalchemy.exc import IntegrityError
from fastapi import BackgroundTasks, HTTPException
from ..settings.email import EmailSettings
from ..models.entity.application_settings import ApplicationSetting
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import secrets

class AuthLogic:
    def __init__(self, logger=None):
        # ユーザーの認証と メール送信設定情報を取得
        auth_settings = AuthSettings()
        email_settings = EmailSettings()

        self.pwd_context = auth_settings.passlib_context
        self.secret_key = auth_settings.SECRET_KEY
        self.algorithm = auth_settings.ALGORITHM
        self.sender_email = email_settings.EMAIL_IMAP_USERNAME
        self.sender_password = email_settings.EMAIL_IMAP_PASSWORD
        self.smtp_host = email_settings.EMAIL_IMAP_HOST
        self.smtp_port = email_settings.EMAIL_IMAP_PORT
        self.smtp_ssl = email_settings.EMAIL_IMAP_SSL


    def create_user(self, db: Session, data: dict) -> users.User:
        username = data['username']
        email = data['email']

        try:
        
            # ユーザーが存在するかどうかを確認 同じ username と email が存在する場合は、ユーザーを作成しない
            user = db.query(users.User).filter(users.User.username == username, users.User.email == email).first()

            # ユーザーが存在する場合は、None を返す
            if user:
                return None
            
            # パスワードをハッシュ化して、ユーザーを作成
            hashed_password = self.pwd_context.hash(data['password'])
            # ユーザーを作成
            user = users.User(username=data['username'], email=data['email'], hashed_password=hashed_password, role=data['role'])

            try:
                # ユーザーをデータベースに追加
                db.add(user)
                db.commit()
                db.refresh(user)

            except IntegrityError as e:
                print("IntegrityError", e)
                return None
            
            # ユーザ設定のmodelを作成
            user_settings = ApplicationSetting(user_id=user.id)
            db.add(user_settings)
            db.commit()
            db.refresh(user_settings)
            
            user_profile = UserProfile(user_id=user.id)
            db.add(user_profile)
            db.commit()
            db.refresh(user_profile)
        
            return user
        except Exception as e:
            db.rollback()
            return HTTPException(status_code=500, detail="Internal Server Error")
    
    def create_user_from_file(self, db: Session, data: dict):
        username = data['username']
        email = data['email']
        password = data['password']
        role = data['role']
        department = data['department']
        is_student = data['is_student'].lower() == 'true'
        is_international_student = data['is_international_student'] .lower() == 'true'
        first_name = data['first_name']
        last_name = data['last_name']

        try:
            user = db.query(users.User).filter(users.User.username == username,users.User.email == email).first()
            if user:
                raise HTTPException(status_code=400, detail="User already exists")
            
            hashed_password = self.pwd_context.hash(password)
            user = users.User(
                username=username,
                email=email,
                hashed_password=hashed_password, 
                role=role, department=department,
                is_student=is_student, 
                is_international_student=is_international_student)

            try:
                db.add(user)
                db.commit()
                db.refresh(user)

            except IntegrityError as e:
                raise HTTPException(status_code=500, detail="Internal Server Error")
            

            # ユーザー設定のmodelを作成
            user_settings = ApplicationSetting(user_id=user.id)
            db.add(user_settings)
            db.commit()
            db.refresh(user_settings)
            
            user_profile = UserProfile(user_id=user.id, first_name=first_name, last_name=last_name)
            db.add(user_profile)
            db.commit()
            db.refresh(user_profile)
        
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    def login_token(self, db: Session, username: str, password: str)->str:
        # ユーザーの認証　ユーザが 存在するかないか を確認
        user = self.__authenticate_user(username, password, db)
        if user is None:
            return None
        
        # アクセストークンとリフレッシュトークンを作成
        access_token = self.create_access_token(user.username, user.id, user.email, user.role, timedelta(hours=10))
        refresh_token = self.create_refresh_token(user.id, timedelta(days=7))

        return access_token, refresh_token
    

    def __authenticate_user(self, username: str, password: str, db)->users.User:
        # ユーザーが存在するかどうかを確認
        user = db.query(users.User).filter(users.User.username == username).first()
        
        # ユーザが 存在する場合は、パスワードを確認
        if not user or not self.pwd_context.verify(password, user.hashed_password):
            return None 
        
        return user
    
    def create_access_token(self, username: str, user_id: int, email: str, role: str, expires_delta: timedelta)->str:
        # ユーザー情報をエンコード
        encode = {'sub': username, 'id': user_id, 'email': email, 'role': role}

        # トークンの有効期限を設定
        expire = datetime.utcnow() + expires_delta

        # エンコードに有効期限を追加
        encode.update({"exp": expire})

        # トークンを作成
        token = jwt.encode(encode, self.secret_key, algorithm=self.algorithm)

        return token
    
    def create_refresh_token(self, user_id: int, expires_delta: timedelta) -> str:
        
        encode = {'sub': str(user_id)}

        expire = datetime.utcnow() + expires_delta
        encode.update({"exp": expire})

        # トークンを作成
        token = jwt.encode(encode, self.secret_key, algorithm=self.algorithm)

        return token
    
    def verify_token(self, token: str):
        try:
            # トークンをデコード
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])

            return payload
        
        except jwt.JWTError:
            return None
    
    # token からユーザー情報を取得
    def current_user(self, token: str)->dict:
        # トークンをデコード
        payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])

        # ユーザー情報を取得
        username = payload.get("sub")
        user_id = payload.get("id")
        email = payload.get("email")
        role = payload.get("role")

        # ユーザー情報が存在しない場合は、None を返す
        if username is None or user_id is None or email is None or role is None:
            return None
        
        return {"username": username, "id": user_id, "email": email, "role": role}
    

    def chnage_password(self, db: Session, username: str, old_password: str, new_password: str):
        # ユーザーが存在するかどうかを確認
        user = db.query(users.User).filter(users.User.username == username).first()

        # ユーザーが存在しない場合は、None を返す
        if user is None:
            return None
        
        # ユーザのパスワードと 入力されたパスワードを比較 
        if not self.pwd_context.verify(old_password, user.hashed_password):
            return None
        
        # パスワードをハッシュ化して、ユーザーのパスワードを変更
        user.hashed_password = self.pwd_context.hash(new_password)
        try:
            # ユーザーをデータベースに追加
            db.add(user)
            db.commit()
            db.refresh(user)

        except IntegrityError:
            return None
        return user
    
    # ユーザー id からユーザーを取得
    def get_user_by_user_id(self, db: Session, user_id: int)->users.User:
        # ユーザーを取得
        user = db.query(users.User).filter(users.User.id == user_id).first()

        if user is None:
            return None
  
        user_model = users.User(id=user.id, username=user.username, email=user.email, role=user.role)

        return user_model
    
    # パスワードリセットリンクを送信
    def password_reset_link(self, db: Session, email: str, background_tasks: BackgroundTasks):

        user = db.query(users.User).filter(users.User.email == email).first()

        if user is None:
            return None
        
        email = user.email
        subject = "Password Reset Link"
        message = "Click on the link to reset your password"
        token = self.__generate_token()
        password_reset_link = f"http://localhost:8000/auth/password_reset_confirm/{token}/"
        message = f"{message}: {password_reset_link}"
        background_tasks.add_task(self.__send_email, email, subject, message)
        return email

    # メールを送信
    def __send_email(self, receiver: str, subject: str, message: str):
        try:

            msg = MIMEMultipart()
            # メールの送信元と送信先を設定
            msg['From'] = self.sender_email
            msg['To'] = receiver
            msg['Subject'] = subject

            # メールの本文を設定
            msg.attach(MIMEText(message, 'plain'))
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            text = msg.as_string()
            server.sendmail(self.sender_email, receiver, text)
            server.quit()

        except Exception:
            return None
        
    def __generate_token(self) -> str:
        # TODO: add expiration time in token
        #TODO: save token to database or session
        return secrets.token_hex(32)


    def __store_token(self):
        # TODO: store token to database or session
        pass

    def verify_password_reset_token(self, db: Session, token: str):
        # TODO: verify token from database or session
        # TODO: if token is valid then change password
        pass
