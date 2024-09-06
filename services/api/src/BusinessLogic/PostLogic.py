from email.mime import image
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, exists, join, and_,desc
from typing import List, Optional, Dict
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import List
from ..models.entity.post import Post, PostImage, PostVideo, PostFile
from ..models.entity.comments import Comment,CommentReply
from ..models.entity.likes import Likes
from ..utils.post_utils import PostUtils
from ..models.entity.user_profile import UserProfile
from ..models.entity.users import User
from ..schemas.posts import  *
from fastapi import Request
from datetime import datetime
import os
import shutil

class PostLogic:
    POST_IMAGE_PATH = os.path.join("static", "post")
    
    @staticmethod
    def create_post(db: Session, user_id: int, content: str, image_data: List[dict]) -> Post:
        try:
            if not content and not image_data:
                raise HTTPException(status_code=400, detail="Content or image is required")
            
            # 新しい投稿を作成
            new_post = Post(user_id=user_id, is_active=True, created_at=PostUtils.get_current_time())
            db.add(new_post)
            db.commit()
            db.refresh(new_post)

            # コンテンツがある場合、投稿に設定
            if content:
                new_post.content = content

            # 画像データが提供された場合
            if image_data:
                # 画像を保存するためのディレクトリを作成
                PostLogic._create_save_dirs()
                
                for image_info in image_data:
                    # タイムスタンプを用いて一意のファイル名を生成
                    timestamp = datetime.now().timestamp()
                    image_name = f"{new_post.id}_{int(timestamp * 1000)}_{image_info['filename']}"
                    file_path = os.path.join(PostLogic.POST_IMAGE_PATH, image_name)

                    # 画像ファイルを保存
                    try:
                        with open(file_path, "wb") as file:
                            shutil.copyfileobj(image_info['file_object'], file)
                    except IOError as e:
                        # ファイル書き込みに失敗した場合のエラーメッセージ
                        raise HTTPException(status_code=500, detail=f"Failed to save image: {e}")

                    # PostImageエンティティを作成し、投稿に関連付け
                    post_image = PostImage(post_id=new_post.id, url=image_name)
                    db.add(post_image)

            # データベースに変更をコミット
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

        posts = [PostLogic._format_post_data(db, post, request, user) for post in posts]
        return posts

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
        # post_data["comments"] = PostLogic._get_comment(db, post_id, request)

        return post_data

    @staticmethod
    def get_user_profile_by_user_id(db: Session, user_id: int, request: Request) -> dict:
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
            "images": [str(request.url_for('static', path=os.path.join('post', image.url))) for image in post.images] if post.images else []
        }

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
                "user": PostLogic.get_user_profile_by_user_id(db, comment.user_id, request),
                "replies": PostLogic._get_reply(db, comment.id),
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
  
    @staticmethod
    def _get_reply(db: Session, comment_id: int) -> List[dict]:
        # CommentReply モデルからリプライを取得
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
