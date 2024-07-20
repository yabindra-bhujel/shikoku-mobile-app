from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Reminder(Base):
    __tablename__ = 'reminders'

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    time_to_do = Column(DateTime(timezone=True), nullable=False)
    time_to_remind = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f'Reminder(id={self.id}, user={self.user_id})'