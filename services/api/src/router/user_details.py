from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from sqlalchemy.sql import exists
from ..models.database import get_db
from ..auth.router import get_current_user
from ..models.entity.users import User
from ..models.entity.user_profile import UserProfile
from ..schemas.user_details import *
from ..models.entity.user_details import Skill, Interest, ClubActivity, user_club_activities_association, user_interests_association, user_skills_association

router = APIRouter(prefix="/user_info", tags=["User Info"])
db_dependency = Depends(get_db)


@router.put("", status_code=status.HTTP_200_OK)
def update_user_bio(user: User = Depends(get_current_user), db: Session = db_dependency, bio: str = Form(...)):
    try:
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()

        if user_profile is None:
            user_profile = UserProfile(user_id=user.id, bio=bio)
            db.add(user_profile)
            db.commit()
        else:
            user_profile.bio = bio
            db.commit()

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/bio", status_code=status.HTTP_200_OK, response_model=UserInfo)
async def get_user_info(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        user_skills = db.query(Skill).join(User.skills).filter(User.id == user.id).all()
        user_interests = db.query(Interest).join(User.interests).filter(User.id == user.id).all()
        user_club_activities = db.query(ClubActivity).join(User.club_activities).filter(User.id == user.id).all()

        skills = [SkillSchema(id=skill.id, name=skill.name) for skill in user_skills]
        interests = [InterestSchema(id=interest.id, name=interest.name) for interest in user_interests]
        club_activities = [ClubActivitySchema(id=club_activity.id, name=club_activity.name) for club_activity in user_club_activities]

        return UserInfo(user_id=user.id, skills=skills, interests=interests, club_activities=club_activities)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

@router.post("/skills", status_code=status.HTTP_201_CREATED)
def add_skill(user: User = Depends(get_current_user), db: Session = db_dependency, skill: str = Form(...)):
    try:
        user = db.query(User).filter(User.id == user.id).first()
        # Check if the skill already exists and if the user already has it
        skill_exists_for_user = db.query(
            exists().where(
                (Skill.name == skill) &
                (user_skills_association.c.user_id == user.id) &
                (user_skills_association.c.skill_id == Skill.id)
            )
        ).scalar()

        if skill_exists_for_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill already exists for user")

        # Check if the skill exists in the database
        existing_skill = db.query(Skill).filter(Skill.name == skill).first()
        if not existing_skill:
            # Create a new skill if it doesn't exist
            new_skill = Skill(name=skill)
            db.add(new_skill)
            db.commit()
            db.refresh(new_skill)
        else:
            new_skill = existing_skill

        # Associate the skill with the user
        user.skills.append(new_skill)
        db.commit()

        return {"message": f"Skill '{skill}' added successfully to user '{user.username}'"}

    except Exception as e:
        db.rollback()  
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

@router.post("/interest", status_code=status.HTTP_201_CREATED)
def add_interest(user: User = Depends(get_current_user), db: Session = db_dependency, interests: str = Form(...)):
    try:
        user = db.query(User).filter(User.id == user.id).first()
        # Check if the interest already exists and if the user already has it
        interest_exists_for_user = db.query(
            exists().where(
                (Interest.name == interests) &
                (user_interests_association.c.user_id == user.id) &
                (user_interests_association.c.interest_id == Interest.id)
            )
        ).scalar()

        if interest_exists_for_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Interest already exists for user")

        # Check if the Interest exists in the database
        existing_interest = db.query(Interest).filter(Interest.name == interests).first()
        if not existing_interest:
            # Create a new Interest if it doesn't exist
            new_interest = Interest(name=interests)
            db.add(new_interest)
            db.commit()
            db.refresh(new_interest)
        else:
            new_interest = existing_interest

        # Associate the interest with the user
        user.interests.append(new_interest)
        db.commit()

        return {"message": f"Skill '{interests}' added successfully to user '{user.username}'"}

    except Exception as e:
        db.rollback()  
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

@router.post("/club_activities", status_code=status.HTTP_201_CREATED)
def add_club_activities(
    user: User = Depends(get_current_user), 
    db: Session = db_dependency, 
    club_activities: str = Form(...)):
    try:
        # Fetch user instance
        user = db.query(User).filter(User.id == user.id).first()

        # Check if the ClubActivity already exists for this user
        club_activities_for_user = db.query(
            exists().where(
                (ClubActivity.name == club_activities) &
                (user_club_activities_association.c.user_id == user.id) &
                (user_club_activities_association.c.club_activity_id == ClubActivity.id)
            )
        ).scalar()

        if club_activities_for_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ClubActivity already exists for user")

        # Check if the ClubActivity exists in the database
        existing_club_activities = db.query(ClubActivity).filter(ClubActivity.name == club_activities).first()

        if not existing_club_activities:
            # Create a new ClubActivity if it doesn't exist
            new_club_activities = ClubActivity(name=club_activities)
            db.add(new_club_activities)
            db.commit()
            db.refresh(new_club_activities)
        else:
            new_club_activities = existing_club_activities

        # Associate the ClubActivity with the user
        user.club_activities.append(new_club_activities)
        db.commit()

        return {"message": f"ClubActivity '{club_activities}' added successfully to user '{user.username}'"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    user: User = Depends(get_current_user),
    db: Session = db_dependency
):
    try:
        # Fetch the user
        user = db.query(User).filter(User.id == user.id).first()

        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Fetch the skill to be deleted
        skill = db.query(Skill).filter(Skill.id == skill_id).first()

        if skill is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

        # Check if the user has the skill
        if skill not in user.skills:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill not associated with user")

        # Remove the skill from the user's skills
        user.skills.remove(skill)
        db.commit()

        return {"message": f"Skill with ID '{skill_id}' removed successfully from user '{user.username}'"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

@router.delete("/interests/{interest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_iinterest(
    interest_id: int,
    user: User = Depends(get_current_user),
    db: Session = db_dependency
):
    try:
        # Fetch the user
        user = db.query(User).filter(User.id == user.id).first()

        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Fetch the Interest to be deleted
        interest = db.query(Interest).filter(Interest.id == interest_id).first()

        if interest is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

        # Check if the user has the Interest
        if interest not in user.interests:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill not associated with user")

        # Remove the Interest from the user's Interests
        user.interests.remove(interest)
        db.commit()

        return {"message": f"Skill with ID '{interest_id}' removed successfully from user '{user.username}'"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

@router.delete("/club_activities/{club_activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_club_activity(
    club_activity_id: int,
    user: User = Depends(get_current_user),
    db: Session = db_dependency
):
    try:
        # Fetch the user
        user = db.query(User).filter(User.id == user.id).first()

        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Fetch the ClubActivity to be deleted
        club_activity = db.query(ClubActivity).filter(ClubActivity.id == club_activity_id).first()

        if club_activity is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ClubActivity not found")

        # Check if the user has the ClubActivity
        if club_activity not in user.club_activities:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ClubActivity not associated with user")

        # Remove the ClubActivity from the user's ClubActivities
        user.club_activities.remove(club_activity)
        db.commit()

        return {"message": f"ClubActivity with ID '{club_activity_id}' removed successfully from user '{user.username}'"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

