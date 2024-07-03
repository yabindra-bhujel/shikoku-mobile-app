from ast import List
import os
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from typing import  Optional, List
from ..models.database import get_db
from ..models.entity.users import User
from ..models.entity.group import Group
from ..auth.router import get_current_user
from ..auth.permissions import authenticate_user
import shutil

router = APIRouter(prefix="/groups", tags=["Group"])
db_dependency = Depends(get_db)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_group(db: Session = db_dependency, user: User = Depends(get_current_user),
    name: str = Form(...), description: Optional[str] = Form(None), group_type: Optional[str] = Form(None)
):
    try:
        new_group = Group(name=name, description=description, group_type=group_type, admin_id=user.id)
        db.add(new_group)
        db.commit()
        db.refresh(new_group)
        return new_group
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.get("", status_code=status.HTTP_200_OK)
async def get_groups(request: Request, db: Session = Depends(get_db), user: User = Depends(authenticate_user)):
    try:
        # Filter groups where the user is either an admin or a member
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

        return {"groups": group_list}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_group(
    request: Request,
    group_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
    try:
        group = db.query(Group).filter(Group.id == group_id).first()
        if group is None:
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
    

@router.put("/{group_id}", status_code=status.HTTP_200_OK)
async def update_group(group_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user),
    name: Optional[str] = Form(None), description: Optional[str] = Form(None), group_type: Optional[str] = Form(None)
):
    try:
        group = db.query(Group).filter(Group.id == group_id).first()
        if group is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        
        if name:
            group.name = name
        if description:
            group.description = description
        if group_type:
            group.group_type = group_type
        
        db.commit()
        db.refresh(group)
        return group
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(group_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
    try:
        group = db.query(Group).filter(Group.id == group_id).first()
        if group is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        
        if group.admin_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the admin of this group")
        
        db.delete(group)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/{group_id}/update_icon", status_code=status.HTTP_200_OK)
async def update_group_icon(
    request: Request,
    group_id: int, db: Session = db_dependency,
    user: User = Depends(authenticate_user),
    icon: UploadFile = File(...)
):
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


@router.post("/{group_id}/add_members", status_code=status.HTTP_200_OK)
async def add_group_member(
    group_id: int, db: Session = db_dependency,
    user: User = Depends(authenticate_user),
    user_list: Optional[List[str]] = Form(...)
):
    pass

    # TODO: implement code



@router.post("/{group_id}/remove_members", status_code=status.HTTP_200_OK)
async def remove_group_member(
    group_id: int, db: Session = db_dependency,
    user: User = Depends(authenticate_user),
    user_list: Optional[List[str]] = Form(...)
):
    pass

    # TODO: implement code




