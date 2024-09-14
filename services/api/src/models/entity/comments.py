from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
from .users import User
from .post import Post

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())

    # Relationships
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user = relationship('User', back_populates='comments')
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    post = relationship('Post', back_populates='comments')
    replies = relationship('CommentReply', back_populates='parent_comment', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Comment(id={self.id}, content={self.content})'
    

class CommentReply(Base):
    __tablename__ = 'comment_replies'

    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())

    # Relationships
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user = relationship('User', back_populates='comment_replies')
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    post = relationship('Post', back_populates='comment_replies')
    parent_comment_id = Column(Integer, ForeignKey('comments.id', ondelete='CASCADE'), nullable=False)
    parent_comment = relationship('Comment', back_populates='replies')

    # Reference to parent comment (same table)
    parent_reply_id = Column(Integer, ForeignKey('comment_replies.id', ondelete='CASCADE'), nullable=True)
    parent_reply = relationship('CommentReply', remote_side=[id], backref='replies')


    def __repr__(self):
        return f'CommentReply(id={self.id}, content={self.content})' 