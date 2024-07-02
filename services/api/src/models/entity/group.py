from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from ..database import Base
import enum
from sqlalchemy.orm import relationship

class GroupType(enum.Enum):
    PUBLIC = 'public'
    PRIVATE = 'private'

# Association table for many-to-many relationship between groups and users
group_members_association = Table(
    'group_members_association', Base.metadata,
    Column('group_id', Integer, ForeignKey('groups.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class Group(Base):
    __tablename__ = 'groups'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    group_type = Column(String, default=GroupType.PRIVATE.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    admin_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    group_image = Column(String, nullable=True)

    # Relationships
    admin = relationship("User", uselist=False, back_populates="admin_group")
    group_members = relationship("User", secondary=group_members_association, back_populates="member_groups")

    def __repr__(self):
        return f'Group: {self.name}'