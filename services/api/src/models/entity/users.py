from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from ..database import Base
import enum
from sqlalchemy.orm import relationship


class UserRole(enum.Enum):
    ADMIN = 'admin'
    STAFF = 'staff'
    STUDENT = 'student'
    TEACHER = 'teacher'
    USER = 'user'

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    role = Column(String, default=UserRole.USER.value)

    # Relationships
    calendars = relationship("Calendar", back_populates="user")
    posts = relationship('Post', back_populates='user', cascade='all, delete-orphan')
    comments = relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    comment_replies = relationship('CommentReply', back_populates='user', cascade='all, delete-orphan')
    likes = relationship('Likes', back_populates='user', cascade='all, delete-orphan')





    def __repr__(self):
        return f'User: {self.username}'