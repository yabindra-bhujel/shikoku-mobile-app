from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from fastapi import BackgroundTasks
from pytz import timezone
import random
from ...models.entity.users import User
from ...models.entity.user_otp import UserOtp
from ...settings.email import EmailSettings
from ...models.entity.application_settings import ApplicationSetting
from ..utils.EmailUtils import EmailUtils
jp_tz = timezone('Asia/Tokyo')

class AuthSettingLogic:

    def __init__(self):
        self.email_settings = EmailSettings()
        self.email_utils = EmailUtils()

    def have_two_factor_auth(self, db:Session, user: User) -> bool:
        setting = db.query(ApplicationSetting).filter(ApplicationSetting.user_id == user.id).first()
        if setting is None:
            return False
        return setting.is_two_factor_authentication_enabled

    def generate_otp(self, db:Session, user: User) -> UserOtp:

        # TODO: 安全が方法考える
        otp = str(random.randint(1000, 9999))
        expires_at = datetime.now() + timedelta(minutes=5)
        # 同じユーザの過去のOTPがactiveなら それのexpires_atを更新する
        user_otp = db.query(UserOtp).filter(UserOtp.user_id == user.id).filter(UserOtp.is_active == True).first()
        if user_otp is not None:
            user_otp.expires_at = expires_at
            user_otp.otp = otp
            db.commit()
            db.refresh(user_otp)
            return user_otp

        user_otp = UserOtp(otp=otp, user_id=user.id, expires_at=expires_at)
        db.add(user_otp)
        db.commit()
        db.refresh(user_otp)
        return user_otp
    
    def send_otp(self, user: User, user_otp: UserOtp, background_tasks: BackgroundTasks):
        user_email = user.email
        otp = user_otp.otp
        email_subject = "OTP（ワンタイムパスワード）のご案内"
        email_body = (
            f"こんにちは、{user.user_profile.first_name} {user.user_profile.last_name}様。\n\n"
            f"以下のワンタイムパスワード（OTP）をご利用ください：\n\n"
            f"OTP: {otp}\n\n"
            f"このコードは、一定時間後に無効になりますのでご注意ください。\n"
            f"もしこのメールに覚えがない場合は、無視してください。\n\n"
            f"よろしくお願いいたします。\n\n"
            f"サポートチーム"
        )
        email = self.email_utils.send_email(user_email, email_subject, email_body)
        background_tasks.add_task(email)
    
    def verify_otp(self, db: Session, otp: str) -> bool:
        user_otp = db.query(UserOtp).filter(UserOtp.otp == otp).filter(UserOtp.is_active == True).first()
        
        if user_otp is None:
            return False

        expires_at = user_otp.expires_at
        if expires_at is None:
            return False

        if expires_at.tzinfo is None:
            expires_at = jp_tz.localize(expires_at)
        else:
            expires_at = expires_at.astimezone(jp_tz)
        
        now = datetime.now(jp_tz)
        
        if expires_at >= now:
            user_otp.is_active = False
            db.commit()
            return True
        else:
            return False

        

        
    


