from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class ApplicationSetting(Base):
    __tablename__ = 'application_settings'

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # profile settings
    is_profile_searchable = Column(Boolean, default=True)

    # notification settings
    is_message_notification_enabled = Column(Boolean, default=True)
    is_post_notification_enabled = Column(Boolean, default=True)
    is_survey_notification_enabled = Column(Boolean, default=True)

    # authentication settings
    is_two_factor_authentication_enabled = Column(Boolean, default=False)

    user = relationship('User', back_populates='application_settings')

    def __repr__(self):
        return f'ApplicationSetting(id={self.id}, user_id={self.user_id}, is_dark_mode={self.is_dark_mode})'