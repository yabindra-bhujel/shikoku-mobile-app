from sqlalchemy import Column, String, Integer, ForeignKey, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from ..database import Base


user_skills_association = Table(
    "user_skills_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id"), primary_key=True)
)

user_interests_association = Table(
    "user_interests_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("interest_id", Integer, ForeignKey("interests.id"), primary_key=True)
)

user_club_activities_association = Table(
    "user_club_activities_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("club_activity_id", Integer, ForeignKey("club_activities.id"), primary_key=True)
)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)


class Interest(Base):
    __tablename__ = "interests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)


class ClubActivity(Base):
    __tablename__ = "club_activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

Skill.users = relationship("User", secondary=user_skills_association, back_populates="skills")
Interest.users = relationship("User", secondary=user_interests_association, back_populates="interests")
ClubActivity.users = relationship("User", secondary=user_club_activities_association, back_populates="club_activities")
