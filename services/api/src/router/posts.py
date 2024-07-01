from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.database import get_db
from ..models.entity.users import User
from ..models.entity.post import Post
from ..services.posts_service import PostService
from ..auth.permissions import authenticate_user
from datetime import datetime
import os
from pydantic import BaseModel
import shutil
from ..models.entity.post import Post, PostImage



router = APIRouter(prefix="/posts", tags=["Post"])
db_dependency = Depends(get_db)

def get_timestamp_filename() -> str:
    # Generate a new filename with current timestamp (milliseconds)
    timestamp = datetime.now().timestamp()
    return f"{int(timestamp * 1000)}.jpg"

class PostInput(BaseModel):
    content: Optional[str] = None
    image_files: Optional[List[UploadFile]] = None

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(
    content: Optional[str] = Form(None), 
    images: List[UploadFile] = File(None),
    user: User = Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    try:
        if not content and not images:
            raise HTTPException(status_code=400, detail="Content or Image is required")
        
        new_post = Post(user_id=user.id, is_active=True, created_at=datetime.now())
        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        if content:
            new_post.content = content

        if images:
            for image in images:
                image_path = os.path.join("static", "post", f"{new_post.id}_{get_timestamp_filename()}")
                with open(image_path, "wb") as file:
                    shutil.copyfileobj(image.file, file)
                
                new_image = PostImage(post_id=new_post.id, url=image_path)
                db.add(new_image)
            
        db.commit()
        db.refresh(new_post)


    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
    
 
    
@router.get("", status_code=status.HTTP_200_OK)
async def get_posts(request: Request, db: Session = Depends(get_db), user: User = Depends(authenticate_user)):

    try:
        posts = PostService.get_post(db, request, user)
        return posts
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{post_id}", status_code=status.HTTP_200_OK)
async def get_post(request: Request, post_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
    try:
        post = PostService.get_post_by_id(db, post_id, user, request)
        return post
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    if post.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to delete this post")

    db.delete(post)
    db.commit()

    return None
