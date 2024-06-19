from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base
from sqlalchemy.sql import func

class UserProfile(Base):

    # データベースのテーブル名の定義
    __tablename__ = 'user_profile'

    id = Column(Integer, primary_key=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    # usersテーブルのidを外部キーとして設定
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    user = relationship('User', back_populates='user_profile')

    def __repr__(self):
        return f'UserProfile(id={self.id}, first_name={self.first_name}, last_name={self.last_name})' 