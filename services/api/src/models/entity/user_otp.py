from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base
from sqlalchemy.orm import relationship

class UserOtp(Base):
    __tablename__ = 'user_otp'

    id = Column(Integer, primary_key=True, index=True)
    otp = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship('User', back_populates='otp')

    def __repr__(self):
        return f'<UserOtp(id={self.id}, user_id={self.user_id}, otp={self.otp})>'
