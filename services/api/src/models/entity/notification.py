from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Table, Index ,Boolean
from sqlalchemy.sql import func
from ..database import Base
from sqlalchemy.orm import relationship

# 中間テーブルを定義
user_notifications = Table(
    'user_notifications',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('notification_id', Integer, ForeignKey('notifications.id', ondelete='CASCADE'), primary_key=True),
    __table_args__=(
        Index('idx_user_notification_unique', 'user_id', 'notification_id', unique=True),
    )
)

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    notification_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    possible_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 多対多のリレーションシップを定義
    users = relationship('User',secondary=user_notifications,back_populates='notifications')
    notification_reads = relationship('NotificationRead', back_populates='notification')

    def __repr__(self):
        return f'<Notification(id={self.id}, type={self.notification_type}, message={self.message})>'
    

class NotificationRead(Base):
    __tablename__ = 'notification_reads'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    notification_id = Column(Integer, ForeignKey('notifications.id', ondelete='CASCADE'))
    is_read = Column(Boolean, nullable=False, default=False)
    read_at = Column(DateTime(timezone=True))

    user = relationship('User', back_populates='notifications_read')
    notification = relationship('Notification', back_populates='notification_reads')

    __table_args__ = (
        Index('idx_user_notification', 'user_id', 'notification_id'),
    )

    def mark_as_read(self):
        self.is_read = True
        self.read_at = func.now()
        return self

    def __repr__(self):
        return f'<NotificationRead(user_id={self.user_id}, notification_id={self.notification_id}, read_at={self.read_at})>'
    
   