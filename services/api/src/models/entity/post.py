from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user = relationship('User', back_populates='posts')
    images = relationship('PostImage', back_populates='post', cascade='all, delete-orphan', passive_deletes=True)
    videos = relationship('PostVideo', back_populates='post', cascade='all, delete-orphan', passive_deletes=True)
    files = relationship('PostFile', back_populates='post', cascade='all, delete-orphan', passive_deletes=True)

    def __repr__(self):
        return f'Post(id={self.id}, content={self.content})'
    

class PostImage(Base):
    __tablename__ = 'post_images'

    id = Column(Integer, primary_key=True, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    url = Column(Text, nullable=False)

    post = relationship('Post', back_populates='images')

    def __repr__(self):
        return f'PostImage(id={self.id}, url={self.url})'


class PostVideo(Base):
    __tablename__ = 'post_videos'

    id = Column(Integer, primary_key=True, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    url = Column(Text, nullable=False)

    post = relationship('Post', back_populates='videos')

    def __repr__(self):
        return f'PostVideo(id={self.id}, url={self.url})'


class PostFile(Base):
    __tablename__ = 'post_files'

    id = Column(Integer, primary_key=True, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    url = Column(Text, nullable=False)

    post = relationship('Post', back_populates='files')

    def __repr__(self):
        return f'PostFile(id={self.id}, url={self.url})'
