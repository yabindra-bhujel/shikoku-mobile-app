from sqlalchemy import Column, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class ExpoToken(Base):
    __tablename__ = 'notification_tokens'

    id = Column(Integer, primary_key=True, index=True)
    token = Column(Text, unique=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship('User', back_populates='expo_token')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    
    def __repr__(self):
        return f'<ExpoToken id={self.id} token={self.token} user_id={self.user_id}>'
