from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from ..database import Base
from sqlalchemy.sql import func
import enum

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
class UserProfile(Base):

    # データベースのテーブル名の定義
    __tablename__ = 'user_profile'

    # 一般情報
    id = Column(Integer, primary_key=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())

    # 大学の情報
    department = Column(String, default=Department.JAPANESE_LITERATURE.value)
    is_student = Column(Boolean, default=True)
    is_international_student = Column(Boolean, default=False)
    
    # usersテーブルのidを外部キーとして設定
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    user = relationship('User', back_populates='user_profile')

    def __repr__(self):
        return f'UserProfile(id={self.id}, first_name={self.first_name}, last_name={self.last_name})' 