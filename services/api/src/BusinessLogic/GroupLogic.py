from typing import List, Optional
from sqlalchemy import func, desc
import os
import shutil
from fastapi import HTTPException, Request, status
from ..models.entity.user_profile import UserProfile
from ..models.entity.group_message import GroupMessage
from sqlalchemy.orm import Session
from ..models.entity.users import User
from ..models.entity.group import Group
import pytz

class GroupLogic:
    @staticmethod
    def create_group(
        db: Session, user: User, name: str,
          description: Optional[str], group_type: Optional[str],
          member_list: List[int]
          ) -> Group:
        try:
            if not name:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Group name is required")
            
            if not member_list:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Group members are required")
            
            if user.id not in member_list:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin must be a member of the group")
            
            if len(member_list) != len(set(member_list)):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Duplicate members are not allowed")
            
            if len(member_list) == 0:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Group must have at least 1 member")
            
            new_group = Group(name=name, description=description, group_type=group_type, admin_id=user.id)
            db.add(new_group)
            db.commit()
            db.refresh(new_group)

            GroupLogic.add_member(db, new_group, member_list)

            return new_group
        except Exception as e:
            db.rollback()
            raise HTTPException(detail=str(e))


    @staticmethod
    def get_groups(db: Session, user: User, request: Request):
        try:
            subquery = (
                db.query(
                    Group.id.label('group_id'),
                    func.max(GroupMessage.created_at).label('last_message_time')
                )
                .outerjoin(GroupMessage, Group.id == GroupMessage.group_id)
                .group_by(Group.id)
                .subquery()
            )

            groups = (
                db.query(Group, subquery.c.last_message_time)
                .outerjoin(subquery, Group.id == subquery.c.group_id)
                .filter(
                    (Group.admin_id == user.id) |
                    (Group.group_members.any(id=user.id))
                )
                .order_by(desc(subquery.c.last_message_time).nullslast())
                .all()
            )

            group_list = []
            for group, last_message_time in groups:
                group_data = {
                    "id": group.id,
                    "name": group.name,
                    "admin_id": group.admin_id,
                    "created_at": group.created_at.astimezone(pytz.utc), 
                    "member_count": len(group.group_members),
                    "last_message": None,
                    "group_image": str(request.url_for('static', path=group.group_image)) if group.group_image else None
                }

                if last_message_time:
                    last_message = db.query(GroupMessage).filter(
                        GroupMessage.group_id == group.id,
                        GroupMessage.created_at == last_message_time
                    ).first()

                    if last_message:
                        user_profile = db.query(UserProfile).filter(UserProfile.user_id == last_message.sender_id).first()
                        username = user_profile.first_name + " " + user_profile.last_name if user_profile else last_message.sender.username

                        group_data["last_message"] = {
                            "sender_id": last_message.sender_id,
                            "message": last_message.message,
                            "created_at": last_message.created_at.astimezone(pytz.utc),  
                            "sender": username
                        }

                group_list.append(group_data)

            return group_list

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


    @staticmethod
    def get_group(db: Session, group_id: int, request: Request) -> Group:
        try:
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
            
            group.member_count = len(group.group_members)

            group_members = []
            for member in group.group_members:
                user_profile = member.user_profile
                if user_profile:
                    first_name = user_profile.first_name or ""
                    last_name = user_profile.last_name or ""
                    username = f"{first_name} {last_name}".strip()
                    
                    member_data = {
                        "id": member.id,
                        "profile": {
                            "fullname": username,
                        }
                    }

                    if user_profile.profile_picture:
                        member_data["profile"]["profile_picture"] = str(request.url_for('static', path=user_profile.profile_picture))

                else:
                    member_data = {
                        "id": member.id,
                        "profile": {
                            "fullname": member.username,  # Fallback to username if user_profile is None
                        }
                    }

                group_members.append(member_data)

            group_data = {
                "id": group.id,
                "name": group.name,
                "admin_id": group.admin_id,
                "created_at": group.created_at,
                "description": group.description,
                "member_count": group.member_count,
                "group_type": group.group_type,
                "group_members": group_members
            }

            if group.group_image:
                group_data["group_image"] = str(request.url_for('static', path=group.group_image))

            return group_data

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


    @staticmethod
    def update_group(db: Session, group_id: int, user: User, name: str, description: str, group_type: str) -> Group:
        try:
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")

            if group.admin_id != user.id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the admin of this group")

            if name:
                group.name = name
            if description:
                group.description = description
            if group_type:
                group.group_type = group_type

            db.commit()
            db.refresh(group)
            return group

        except HTTPException:
            raise 
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    @staticmethod
    def delete_group(db: Session, group_id: int, user: User) -> None:
        try:
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")

            if group.admin_id != user.id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the admin of this group")

            db.delete(group)
            db.commit()

        except HTTPException:
            raise 
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    @staticmethod
    def update_group_icon(db: Session, group_id: int, icon: bytes):
        try:
            group = db.query(Group).filter(Group.id == group_id).first()
            if group is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
            
            group_image_path = os.path.join("static", "group_images", f"{group.id}.png")
            
            # ディレクトリが存在しない場合は作成する
            os.makedirs(os.path.dirname(group_image_path), exist_ok=True)

            with db.begin_nested():
                # 古い写真は消す
                if group.group_image:
                    old_file_path = os.path.join("static", group.group_image)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                
                # 新しい写真の追加
                with open(group_image_path, "wb") as buffer:
                    shutil.copyfileobj(icon.file, buffer)
                    
                group.group_image = f"group_images/{group.id}.png"
            
            db.commit()
            db.refresh(group)
            return group
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
    @staticmethod
    def add_member(db: Session, group: Group, member_ids: List) -> Group:
        try:
            if not member_ids:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Member ids are required")

            for member_id in member_ids:
                member = db.query(User).filter(User.id == member_id).first()
                if not member:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
                group.group_members.append(member)
            
            db.commit()
            db.refresh(group)
            return group

        except HTTPException:
            raise 
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
    @staticmethod
    def remove_member(db: Session, group: Group, member_id: int) -> Group:
        try:
            # check if member is in the group
            member = db.query(User).filter(User.id == member_id).first()

            # check member is group admin
            if member.id == group.admin_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin cannot be removed self from the group")
            
            if not member:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
            if member not in group.group_members:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User is not a member of this group")
            
            group.group_members.remove(member)
            db.commit()
            db.refresh(group)
            return group

        except HTTPException:
            raise 
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
    @staticmethod
    def leave(db: Session, group_id: int, user: User) -> None:
        try:
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
            
            if user.id == group.admin_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin cannot leave the group")
            
            # Ensure the user is attached to the session
            user_in_db = db.query(User).filter(User.id == user.id).one_or_none()
            if not user_in_db:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found in database")
            
            group.group_members.remove(user_in_db)
            db.commit()

        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))