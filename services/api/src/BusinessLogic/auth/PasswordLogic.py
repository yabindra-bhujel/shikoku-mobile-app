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

class PasswordLogic:

    def __init__(self):
        self.auth_settings = AuthSettings()

        self.pwd_context = auth_settings.passlib_context
        self.secret_key = auth_settings.SECRET_KEY
        self.algorithm = auth_settings.ALGORITHM

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
    
    # TODO: パスワードリセットトークンを生成するメソッドを実装 データベースで保存する
    def password_reset(self, db: Session, email: str, background_tasks: BackgroundTasks):
        # ユーザーが存在するかどうかを確認
        user = db.query(users.User).filter(users.User.email == email).first()

        # ユーザーが存在しない場合は、None を返す
        if user is None:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        
        # パスワードリセットトークンを生成
        password_reset_token = self.create_password_reset_token(user.username)
        # パスワードリセットトークンをデータベースに保存
        user.password_reset_token = password_reset_token
        db.add(user)
        db.commit()
        db.refresh(user)

        # パスワードリセットメールを送信
        email_subject = "パスワードリセットのご案内"
        email_body = (
            f"こんにちは、{user.user_profile.first_name} {user.user_profile.last_name}様。\n\n"
            f"以下のリンクをクリックして、パスワードをリセットしてください：\n\n"
            f"{self.auth_settings.PASSWORD_RESET_URL}?token={password_reset_token}\n\n"
            f"もしこのメールに覚えがない場合は、無視してください。\n\n"
            f"よろしくお願いいたします。\n\n"
            f"サポートチーム"
        )
        email = self.send_email(user.email, email_subject, email_body)
        background_tasks.add_task(email)
        return user


