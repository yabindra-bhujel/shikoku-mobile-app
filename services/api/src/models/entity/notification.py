from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Table
from sqlalchemy.sql import func
from ..database import Base
from sqlalchemy.orm import relationship

# 中間テーブルを定義
user_notifications = Table(
    'user_notifications',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('notification_id', Integer, ForeignKey('notifications.id', ondelete='CASCADE'), primary_key=True)
)

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    notification_type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 多対多のリレーションシップを定義
    users = relationship(
        'User',
        secondary=user_notifications,
        back_populates='notifications'
    )

    def __repr__(self):
        return f'<Notification(id={self.id}, type={self.notification_type}, message={self.message})>'