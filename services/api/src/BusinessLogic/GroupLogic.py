from typing import List, Optional
import os
import shutil
from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session
from ..models.entity.users import User
from ..models.entity.group import Group

class GroupLogic:
    @staticmethod
    def create_group(db: Session, user: User, name: str, description: Optional[str], group_type: Optional[str]) -> Group:
        try:
            new_group = Group(name=name, description=description, group_type=group_type, admin_id=user.id)
            db.add(new_group)
            db.commit()
            db.refresh(new_group)
            return new_group
        except Exception as e:
            db.rollback()
            raise HTTPException(detail=str(e))

    @staticmethod
    def get_groups(db: Session, user: User, request: Request) -> List[Group]:
        try:
            groups = db.query(Group).filter(
                (Group.admin_id == user.id) |
                (Group.group_members.any(id=user.id))
            ).all()

            group_list = []
            for group in groups:
                group_data = {
                    "id": group.id,
                    "name": group.name,
                    "admin_id": group.admin_id,
                    "created_at": group.created_at,
                }

                if group.group_image:
                    group_data["group_image"] = str(request.url_for('static', path=group.group_image))

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

            group_data = {
                "id": group.id,
                "name": group.name,
                "admin_id": group.admin_id,
                "created_at": group.created_at,
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
    def update_group_icon(db: Session, request: Request, group_id: int, user: User, icon: bytes):
        try:
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")

            group_image_path = os.path.join("static", "group_images", f"{group.id}.png")

            os.makedirs(os.path.dirname(group_image_path), exist_ok=True)

            with db.begin_nested():
                if group.group_image:
                    old_file_path = os.path.join("static", group.group_image)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)

                with open(group_image_path, "wb") as buffer:
                    shutil.copyfileobj(icon.file, buffer)

                group.group_image = f"group_images/{group.id}.png"

            db.commit()
            db.refresh(group)
            return group

        except HTTPException:
            raise 
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
