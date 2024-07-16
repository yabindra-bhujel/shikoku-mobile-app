from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.database import get_db
from ..models.entity.users import User
from ..models.entity.post import Post
from ..auth.router import get_current_user
from ..BusinessLogic.PostLogic import PostLogic
from ..auth.permissions import authenticate_user

router = APIRouter(prefix="/posts", tags=["Post"])
db_dependency = Depends(get_db)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(db: Session = db_dependency,user: User = Depends(get_current_user),
    content: Optional[str] = Form(None),image_files: Optional[List[UploadFile]] = File(None),
    video_files: Optional[List[UploadFile]] = File(None),file_files: Optional[List[UploadFile]] = File(None),
):
    try:
        # ファイルを保存するディレクトリを作成
        files_data = {}
        if image_files is not None:
            files_data['image'] = image_files[0]
        if video_files is not None:
            files_data['video'] = video_files[0]
        if file_files is not None:
            files_data['file'] = file_files[0]

        new_post = PostLogic.create_post(db, user.id, content, files_data)

        return new_post

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
          

@router.get("", status_code=status.HTTP_200_OK)
async def get_posts(db: Session = db_dependency, user: User = Depends(authenticate_user)):
    try:
        posts = PostLogic.get_post(db)
        return posts
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{post_id}", status_code=status.HTTP_200_OK)
async def get_post(post_id: int, db: Session = db_dependency, user: User = Depends(authenticate_user)):
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
