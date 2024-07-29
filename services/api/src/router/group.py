from ast import List
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    File,
    UploadFile,
    Form,
    Request,
)
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from ..models.database import get_db
from ..models.entity.users import User
from ..models.entity.group import Group
from ..auth.router import get_current_user
from ..auth.permissions import authenticate_user
from ..BusinessLogic.GroupLogic import GroupLogic

router = APIRouter(prefix="/groups", tags=["Group"])
db_dependency = Depends(get_db)


class CreateGroupRequest(BaseModel):
    name: str
    description: Optional[str] = None
    group_type: Optional[str] = None
    member_list: Optional[List[int]] = None


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_group(
    db: Session = db_dependency,
    user: User = Depends(get_current_user),
    data: CreateGroupRequest = None,
):
    try:
        name = data.name
        description = data.description
        group_type = data.group_type
        member_list = data.member_list

        new_group = GroupLogic.create_group(
            db, user, name, description, group_type, member_list
        )
        return new_group

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.get("", status_code=status.HTTP_200_OK)
async def get_group_list(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(authenticate_user),
):
    try:
        group_list = GroupLogic.get_groups(db, user, request)

        return {"groups": group_list}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_group(
    request: Request,
    group_id: int,
    db: Session = db_dependency,
    user: User = Depends(authenticate_user),
):
    try:
        group = GroupLogic.get_group(db, group_id, request)

        return group

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.put("/{group_id}", status_code=status.HTTP_200_OK)
async def update_group(
    group_id: int,
    db: Session = db_dependency,
    user: User = Depends(authenticate_user),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    group_type: Optional[str] = Form(None),
):
    try:
        group = GroupLogic.update_group(
            db, group_id, user, name, description, group_type
        )
        return group

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(
    group_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)
):
    try:
        GroupLogic.delete_group(db, group_id, user)

        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.post("/{group_id}/update_icon", status_code=status.HTTP_200_OK)
async def update_group_icon(
    request: Request,
    group_id: int,
    db: Session = db_dependency,
    user: User = Depends(authenticate_user),
    icon: UploadFile = File(...),
):
    try:
        group = GroupLogic.update_group_icon(db, group_id, icon)
        return group
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


class AddMembersRequest(BaseModel):
    user_list: List[int]


@router.post("/{group_id}/add_members", status_code=status.HTTP_200_OK)
async def add_group_member(
    group_id: int, request: AddMembersRequest, db: Session = db_dependency
):
    try:
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Group not found"
            )

        GroupLogic.add_member(db, group, request.user_list)

        return group

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/{group_id}/remove_members", status_code=status.HTTP_200_OK)
async def remove_group_member(
    group_id: int,
    db: Session = db_dependency,
    user: User = Depends(authenticate_user),
    member_id: str = Form(...),
):
    try:
        group = db.query(Group).filter(Group.id == group_id).first()
        if group is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Group not found"
            )

        GroupLogic.remove_member(db, group, member_id)

        return group

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.post("/{group_id}/leave", status_code=status.HTTP_200_OK)
async def leave_group(
    group_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)
):
    try:
        GroupLogic.leave(db, group_id, user)
        return None

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )
