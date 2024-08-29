from fastapi import APIRouter, Depends, HTTPException, status,  File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlalchemy import paginate
from ..models.database import get_db
from ..models.entity.users import User
from ..auth.permissions import authenticate_admin
from ..models.entity.user_profile import UserProfile
from ..filters.AdminUserFilter import AdminUserFilter
from ..settings.auth import AuthSettings
from .utils.EmailUtils import EmailUtils
from ..schemas.admin import UserSchema, UserInput
import random
import string


class AdminUserLogic:

    def __init__(self):
        self.auth = AuthSettings()

    def user_list(self, db: Session, user_filter: AdminUserFilter):
        try:
            query = (
            db.query(
                User.id,
                User.username,
                User.email,
                User.is_active,
                User.department,
                User.joined_at,
                User.role,
                UserProfile.first_name,
                UserProfile.last_name,
                UserProfile.profile_picture
                )
                .join(User.user_profile)
                .options(joinedload(User.user_profile))
            )

            query = user_filter.filter_query(query)
            users = paginate(db, query)

            return users
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def create(self, db: Session, user_input: UserInput):
        new_user, password = self.create_user(db, user_input)
        self.send_email(new_user.email, password)
        return new_user

    def create_user(self, db: Session, user_input: UserInput):
        user_password = self.generate_password()
        hashed_password = self.auth.hash_password(user_password)

        user = User(
            username=user_input.id,
            email=user_input.email,
            role=user_input.role,
            department=user_input.department,
            is_international_student=user_input.internationalStudent,
            hashed_password=hashed_password
        )

        user_profile = UserProfile(
            first_name=user_input.firstName,
            last_name=user_input.lastName,
            user_id=user_input.id
        )

        user.user_profile = user_profile

        db.add(user)
        db.commit()
        db.refresh(user)

        return user, user_password

    def send_email(self, email: str, password: str):
        email_utils = EmailUtils()
        subject = "Account Created"
        body = f"Your account has been created. Your password is {password}. Please change it after your first login."
        email_utils.send_email(email, subject, body)


    def generate_password(self, length: int = 8) -> str:
        """Generate a secure password."""
        if length < 4:
            raise ValueError("Password length must be at least 4 characters.")
        
        # Character selection
        uppercase = random.choice(string.ascii_uppercase)
        lowercase = random.choice(string.ascii_lowercase)
        
        # Avoid using certain ambiguous characters
        special_characters = "!@#$%^&*()-_=+[]{};:,.<>?/`~"
        special = random.choice(special_characters)
        digit = random.choice(string.digits)
        
        # Combine all required character types
        all_characters = [uppercase, lowercase, special, digit]
        
        # Add random characters until the desired length
        if length > 4:
            all_characters += random.choices(
                string.ascii_letters + string.digits + special_characters, 
                k=length - 4
            )
        
        # Shuffle the characters to ensure randomness
        random.shuffle(all_characters)
        
        # Return the final password as a string
        password = ''.join(all_characters)
        return password



