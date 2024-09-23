from sqlalchemy.orm import Session, joinedload
from sqlalchemy import  exists,  and_,desc
from typing import List, Optional
from fastapi import HTTPException, status, Request
import os
import shutil
from datetime import datetime
from typing import List
from ..models.entity.post import Post, PostImage
from ..models.entity.comments import Comment, CommentReply
from ..models.entity.likes import Likes
from ..utils.post_utils import PostUtils
from ..models.entity.user_profile import UserProfile
from ..models.entity.users import User
from ..services.PushNotificationService import PushNotificationService

class PostLogic:
    
    @staticmethod
    def create_post(db: Session, user_id: int, content: str, image_data: List[dict]) -> Post:
        try:
            new_post = Post(user_id=user_id, is_active=True, created_at=PostUtils.get_current_time())
            db.add(new_post)
            db.commit()
            db.refresh(new_post)

            if content:
                new_post.content = content

            if image_data:
                for image_info in image_data:
                    timestamp = int(datetime.now().timestamp() * 1000) 
                    image_name = f"{new_post.id}_{timestamp}.png"
                    file_path = os.path.join("static", "post", image_name)

                    with open(file_path, "wb") as file:
                        shutil.copyfileobj(image_info['file_object'], file)

                    post_image = PostImage(post_id=new_post.id, url=image_name)
                    db.add(post_image)

            db.commit()
            db.refresh(new_post)

            # send notification to all users
            notification_service = PushNotificationService(db)
            notification_service.send_post_created_notification(new_post)

            return new_post

        except Exception as e:
            db.rollback()
            raise e


    @staticmethod
    def get_post(db: Session, request: Request, user: User) -> List[dict]:
        posts = db.query(Post).options(
            joinedload(Post.images),
            joinedload(Post.videos),
            joinedload(Post.files)
        ).order_by(desc(Post.created_at)).all()

        return [PostLogic._format_post_data(db, post, request, user) for post in posts]

    @staticmethod
    def get_post_by_id(db: Session, post_id: int, user: User, request: Request) -> dict:
        post = db.query(Post).options(
            joinedload(Post.images),
            joinedload(Post.videos),
            joinedload(Post.files)
        ).filter(Post.id == post_id).first()

        if not post:
            return None

        post_data = PostLogic._format_post_data(db, post,request, user)
        post_data["comments"] = PostLogic._get_comment(db, post_id, request)

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

    def _format_post_data(db: Session, post: Post, request: Request, request_user: User) -> dict:

        is_liked = db.query(exists().where(and_(Likes.user_id == request_user.id, Likes.post_id == post.id))).scalar()

        user = PostLogic.get_user_profile_by_user_id(db, post.user_id, request)


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
            base_url = str(request.base_url).rstrip("/") 
            # post_data["images"] = [f"{base_url}/static/post/{image.url}" for image in post.images]
            post_data["images"] = [{"id": image.id, "url": f"{base_url}/static/post/{image.url}"} for image in post.images]



        return post_data    

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
                "user": PostLogic.get_user_profile_by_user_id(db, comment.user_id, request),
                "replies": PostLogic._get_reply(db, comment.id),
            }
            for comment in comments
        ]
  
    def _get_reply(db: Session, comment_id: int) -> List[dict]:
        replies = db.query(CommentReply).filter(CommentReply.parent_comment_id == comment_id).all()
        return [
            {
                "id": reply.id,
                "content": reply.content,
                "created_at": reply.created_at,
                "user_id": reply.user_id,
                "post_id": reply.post_id,
            }
            for reply in replies
        ]
    
    @staticmethod
    def delete_post(db: Session, post_id: int, user_id: int) -> None:
        post = db.query(Post).filter(Post.id == post_id).first()

        if post is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

        if post.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to delete this post")

        db.delete(post)
        db.commit()

    @staticmethod
    def get_user_posts(db: Session, request: Request, user: User) -> List[dict]:

        posts = db.query(Post).options(
            joinedload(Post.images),
        ).filter(Post.user_id == user.id).order_by(desc(Post.created_at)).all()


        return [PostLogic._format_post_data(db, post, request, user) for post in posts]

    @staticmethod
    def delete_post_image(db: Session, post_id: int, image_id: int, user_id: int) -> None:
        post = db.query(Post).filter(Post.id == post_id).first()

        if post is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

        if post.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to delete this post")

        post_image = db.query(PostImage).filter(PostImage.id == image_id).first()

        if post_image is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

        db.delete(post_image)

        if post.content.strip() == "" and len(post.images) == 0:
            db.delete(post)
            db.commit()

        db.commit()
        os.remove(os.path.join("static", "post", post_image.url))
        return None
    
    @staticmethod
    def update_post_content(db: Session, post_id: int, content: str, user_id: int) -> None:
        post = db.query(Post).filter(Post.id == post_id).first()

        if post is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

        if post.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to delete this post")

        post.content = content
        db.commit()
        return None