from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.database import get_db
from ..models.entity.users import User
from ..models.entity.post import Post
from ..auth.router import get_current_user
from ..BusinessLogic.PostLogic import PostLogic
from ..auth.permissions import authenticate_user
from datetime import datetime
import os
from pydantic import BaseModel
import shutil
from ..models.entity.post import Post, PostImage
from typing import Dict



router = APIRouter(prefix="/posts", tags=["Post"])
db_dependency = Depends(get_db)

def get_timestamp_filename() -> str:
    # Generate a new filename with current timestamp (milliseconds)
    timestamp = datetime.now().timestamp()
    return f"{int(timestamp * 1000)}.jpg"


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(
    content: Optional[str] = Form(None), 
    images: List[UploadFile] = File([]),
    user: User = Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    try:
        images_data = []
        for image in images:
            image_data = {
                "filename": image.filename,
                "file_object": image.file
            }
            images_data.append(image_data)

        new_post = PostLogic.create_post(db, user.id, content, images_data)

        return new_post

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("", status_code=status.HTTP_200_OK)
async def get_posts(request: Request, db: Session = Depends(get_db), user: User = Depends(authenticate_user)):

    try:
        posts = PostLogic.get_post(db, request, user)
        return posts
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{post_id}", status_code=status.HTTP_200_OK)
async def get_post(request: Request, post_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
    try:
        post = PostLogic.get_post_by_id(db, post_id)
        return post
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
    try:
        PostLogic.delete_post(db, post_id, user.id)
        return None
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/user/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_posts(
    request: Request, 
    user_id: int,
    db: Session = db_dependency,
    user: User = Depends(authenticate_user)
):
    try:
        posts = PostLogic.get_user_posts(db, request, user)
        print(posts)
        return posts
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
