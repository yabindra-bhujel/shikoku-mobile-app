from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class SchoolEvent(Base):
    __tablename__ = 'school_events'

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime(timezone=True), nullable=False)
    image = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    is_active = Column(Boolean, default=True)
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    creator = relationship('User', back_populates='school_events')


