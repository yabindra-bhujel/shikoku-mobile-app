from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f'Message(id={self.id}, sender={self.sender_id}, receiver={self.receiver_id})'