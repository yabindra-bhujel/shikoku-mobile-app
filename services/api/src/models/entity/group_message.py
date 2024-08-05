from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from ..database import Base
from sqlalchemy.orm import relationship


class GroupMessage(Base):
    __tablename__ = 'group_messages'

    id = Column(Integer, primary_key=True, nullable=False)
    group_id = Column(Integer, ForeignKey('groups.id'), nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sender = relationship("User", back_populates="group_messages")
    group = relationship("Group", back_populates="group_messages")

    def __repr__(self):
        return f'Group Message: {self.message}'