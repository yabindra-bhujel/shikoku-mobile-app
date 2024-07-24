from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base
from sqlalchemy.orm import relationship

class Notification(Base):
    __tablename__ = 'notifications'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now())
    
    users = relationship('User', secondary='user_notifications', back_populates='notifications')

    def __repr__(self):
        return f"<Notification(title={self.title})>"

class UserNotification(Base):
    __tablename__ = 'user_notifications'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    notification_id = Column(Integer, ForeignKey('notifications.id'), nullable=False)
    is_read = Column(Boolean, default=False)
    
    user = relationship('User', back_populates='user_notifications')
    notification = relationship('Notification', back_populates='user_notifications')
    
    def __repr__(self):
        return f"<UserNotification(user_id={self.user_id}, notification_id={self.notification_id}, is_read={self.is_read})>"
