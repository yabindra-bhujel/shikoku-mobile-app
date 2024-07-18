from email.mime import image
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, exists, join, and_,desc
from typing import List, Optional
from ..models.entity.post import Post, PostImage, PostVideo, PostFile
from ..models.entity.comments import Comment
from ..models.entity.likes import Likes
from ..utils.post_utils import PostUtils
from ..models.entity.user_profile import UserProfile
from ..models.entity.users import User
from fastapi import Request
from datetime import datetime, timezone
import os
import shutil



class PostService:
    POST_IMAGE_PATH = "static/post/post_images"

    @staticmethod
    def _create_save_dirs():
        os.makedirs(PostService.POST_IMAGE_PATH, exist_ok=True)
    
    @staticmethod
    def get_timestamp_filename() -> str:
        # Generate a new filename with current timestamp (milliseconds)
        timestamp = datetime.now().timestamp()
        return f"{int(timestamp * 1000)}.jpg"

    @staticmethod
    def save_post_image(post_id: int, image: bytes) -> str:
        PostService._create_save_dirs()
        file_name = PostService.get_timestamp_filename()
        image_path = os.path.join(PostService.POST_IMAGE_PATH, f"{post_id}_{file_name}")
        with open(image_path, "rb") as file:
            file.write(image)
        return image_path
    
    @staticmethod
    def create_post(db: Session, user_id: int, content: str, image_data: List[dict]) -> Post:
        try:
            new_post = Post(user_id=user_id, is_active=True, created_at=PostUtils.get_current_time())
            db.add(new_post)
            db.commit()
            db.refresh(new_post)

            if content:
                new_post.content = content

            timestamp = datetime.now().timestamp()
            file_path = os.path.join("static", "user_profile", f"{new_post.id}_{int(timestamp * 1000)}.png")

            

            if image_data:
                for image_info in image_data:
                    with open(file_path, "wb") as file:
                        shutil.copyfileobj(image_info['file_object'], file)

                    image_name = f"{new_post.id}_{image_info.filename}"
                    
                    post_image = PostImage(post_id=new_post.id, url=image_name)
                    db.add(post_image)

            db.commit()
            db.refresh(new_post)
            return new_post

        except Exception as e:
            db.rollback()
            raise e

        finally:
            db.close()

    @staticmethod
    def get_post(db: Session, request: Request, user: User) -> List[dict]:
        posts = db.query(Post).options(
            joinedload(Post.images),
            joinedload(Post.videos),
            joinedload(Post.files)
        ).order_by(desc(Post.created_at)).all()

        return [PostService._format_post_data(db, post, request, user) for post in posts]

    @staticmethod
    def get_post_by_id(db: Session, post_id: int, user: User, request: Request) -> dict:
        post = db.query(Post).options(
            joinedload(Post.images),
            joinedload(Post.videos),
            joinedload(Post.files)
        ).filter(Post.id == post_id).first()

        if not post:
            return None

        post_data = PostService._format_post_data(db, post,request, user)
        post_data["comments"] = PostService._get_comment(db, post_id, request)
        return post_data

    @staticmethod
    def get_user_profile_by_user_id(db: Session, user_id: int, request: Request) -> Optional[dict]:
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if user_profile:
            user = db.query(User).filter(User.id == user_id).first()
            poster_profile_data = {
                "id": user.id,
                "first_name": user_profile.first_name,
                "last_name": user_profile.last_name,
            }

            if user_profile.profile_picture:
                poster_profile_data["profile_picture"] = str(request.url_for('static', path=user_profile.profile_picture))
            
            return poster_profile_data
        
        return None

    @staticmethod
    def _format_post_data(db: Session, post: Post, request: Request, request_user: User) -> dict:

        is_liked = db.query(exists().where(and_(Likes.user_id == request_user.id, Likes.post_id == post.id))).scalar()

        user = PostService.get_user_profile_by_user_id(db, post.user_id, request)


        post_data =  {
            "id": post.id,
            "content": post.content,
            "created_at": post.created_at,
            "user": user,
            "is_active": post.is_active,
            "total_comments": post.total_comments,
            "total_likes": post.total_likes,
            "is_liked": is_liked,
        }

        if post.images:
            base_url = str(request.base_url)
            post_data["images"] = [base_url + image.url for image in post.images]

        return post_data    


    @staticmethod
    def _get_total_comments(db: Session, post_id: int) -> int:
        return db.query(func.count(Comment.id)).filter(Comment.post_id == post_id).scalar()

    @staticmethod
    def _get_total_likes(db: Session, post_id: int) -> int:
        return db.query(func.count(Likes.id)).filter(Likes.post_id == post_id).scalar()

    @staticmethod
    def _get_comment(db: Session, post_id: int, request: Request) -> List[dict]:
        try:
            comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(desc(Comment.created_at)).all()
        except Exception as e:
            raise e
        return [
            {
                "id": comment.id,
                "content": comment.content,
                "created_at": comment.created_at,
                "post_id": comment.post_id,
                "user": PostService.get_user_profile_by_user_id(db, comment.user_id, request),
            }
            for comment in comments
        ]


    @staticmethod
    def _format_time(time: str) -> str:
        parsed_time = datetime.fromisoformat(time[:-6])

        current_time = datetime.utcnow()
        time_difference = current_time - parsed_time

        years = time_difference.days // 365
        months = time_difference.days // 30
        days = time_difference.days
        hours = time_difference.seconds // 3600
        minutes = (time_difference.seconds // 60) % 60

        if years > 0:
            return f"{years} 年{'' if years > 1 else ''}"
        elif months > 0:
            return f"{months} 月{'' if months > 1 else ''}"
        elif days > 0:
            return f"{days} 日{'' if days > 1 else ''}"
        elif hours > 0:
            return f"{hours} 時間{'' if hours > 1 else ''}"
        elif minutes > 0:
            return f"{minutes} 分{'' if minutes > 1 else ''}"
        else:
            return "今" 
  
