from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
from sqlalchemy.sql import func
from .users import User

class Calendar(Base):
    __tablename__ = 'calendar'

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    color = Column(String, nullable=False, default='#6d62a8')
    reminder_offset = Column(Integer, nullable=True)
    is_reminder = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='calendars')

    def __repr__(self):
        return f'Calendar(id={self.id}, title={self.title}, start_time={self.start_time}, end_time={self.end_time})'
