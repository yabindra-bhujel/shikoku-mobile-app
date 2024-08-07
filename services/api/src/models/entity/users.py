from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from ..database import Base
import enum
from sqlalchemy.orm import relationship
from .notification import user_notifications
from .group import group_members_association

class UserRole(enum.Enum):
    ADMIN = 'admin'
    STAFF = 'staff'
    STUDENT = 'student'
    TEACHER = 'teacher'
    USER = 'user'

class Department(enum.Enum):
    JAPANESE_LITERATURE = 'literature'
    CALLIGRAPHY_AND_CULTURE = 'culture'
    INTERNATIONAL_CULTURE = 'international'
    BUSINESS_INFORMATION = 'business'
    MEDIA_INFORMATION = 'media'
    HUMAN_LIFE_SCIENCES = 'human_life'
    HEALTH_NUTRITION = 'health_nutrition'
    CHILD_STUDIES = 'child_studies'
    NURSING = 'nursing'

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    role = Column(String, default=UserRole.USER.value)

    # 大学の情報
    department = Column(String, default=Department.JAPANESE_LITERATURE.value)
    is_student = Column(Boolean, default=True)
    is_international_student = Column(Boolean, default=False)
    

    # Relationships
    calendars = relationship("Calendar", back_populates="user")
    user_profile = relationship("UserProfile", uselist=False, back_populates="user", cascade="all, delete-orphan")

    posts = relationship('Post', back_populates='user', cascade='all, delete-orphan')
    comments = relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    comment_replies = relationship('CommentReply', back_populates='user', cascade='all, delete-orphan')
    likes = relationship('Likes', back_populates='user', cascade='all, delete-orphan')

    notifications = relationship('Notification',secondary=user_notifications,back_populates='users')
    # Relationships for groups
    admin_groups = relationship("Group", back_populates="admin")
    member_groups = relationship("Group", secondary=group_members_association, back_populates="group_members")
    group_messages = relationship("GroupMessage", back_populates="sender")

    # Relationships for school events
    school_events = relationship('SchoolEvent', back_populates='creator', cascade='all, delete-orphan')


    def __repr__(self):
        return f'User: {self.username}'
