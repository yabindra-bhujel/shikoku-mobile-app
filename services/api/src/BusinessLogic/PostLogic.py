from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import List
from ..models.entity.post import Post, PostImage, PostVideo, PostFile
from ..models.entity.comments import Comment
from ..models.entity.likes import Likes
from ..utils.post_utils import PostUtils

class PostLogic:

    @staticmethod
    def create_post(db: Session, user_id: int, content: str, files_data: dict) -> Post:
        try:
            new_post = Post(user_id=user_id, is_active=True, created_at=PostUtils.get_current_time())
            db.add(new_post)
            db.commit()
            db.refresh(new_post)

            if content:
                new_post.content = content

            if 'image' in files_data:
                image_path = PostUtils.save_post_image(new_post.id, files_data['image'])
                post_image = PostImage(post_id=new_post.id, url=image_path)
                db.add(post_image)

            if 'video' in files_data:
                video_path = PostUtils.save_post_video(new_post.id, files_data['video']['data'], files_data['video']['ext'])
                post_video = PostVideo(post_id=new_post.id, url=video_path)
                db.add(post_video)

            if 'file' in files_data:
                file_path = PostUtils.save_post_file(new_post.id, files_data['file']['data'], files_data['file']['filename'])
                post_file = PostFile(post_id=new_post.id, url=file_path)
                db.add(post_file)

            db.commit()
            db.refresh(new_post)
            return new_post

        except Exception as e:
            db.rollback()
            raise e

        finally:
            db.close()

    @staticmethod
    def get_post(db: Session) -> List[dict]:
        posts = db.query(Post).options(
            joinedload(Post.images),
            joinedload(Post.videos),
            joinedload(Post.files)
        ).all()

        return [PostLogic._format_post_data(db, post) for post in posts]

    @staticmethod
    def get_post_by_id(db: Session, post_id: int) -> dict:
        post = db.query(Post).options(
            joinedload(Post.images),
            joinedload(Post.videos),
            joinedload(Post.files)
        ).filter(Post.id == post_id).first()

        if not post:
            return None

        post_data = PostLogic._format_post_data(db, post)
        post_data["comments"] = PostLogic._get_comment(db, post_id)
        return post_data


    @staticmethod
    def _format_post_data(db: Session, post: Post) -> dict:
        return {
            "id": post.id,
            "content": post.content,
            "images": [image.url for image in post.images],
            "videos": [video.url for video in post.videos],
            "files": [file.url for file in post.files],
            "created_at": post.created_at,
            "user_id": post.user_id,
            "is_active": post.is_active,
            "total_comments": PostLogic._get_total_comments(db, post.id),
            "total_likes": PostLogic._get_total_likes(db, post.id),
        }

    @staticmethod
    def _get_total_comments(db: Session, post_id: int) -> int:
        return db.query(func.count(Comment.id)).filter(Comment.post_id == post_id).scalar()

    @staticmethod
    def _get_total_likes(db: Session, post_id: int) -> int:
        return db.query(func.count(Likes.id)).filter(Likes.post_id == post_id).scalar()

    @staticmethod
    def _get_comment(db: Session, post_id: int) -> List[dict]:
        comments = db.query(Comment).filter(Comment.post_id == post_id).all()
        return [
            {
                "id": comment.id,
                "content": comment.content,
                "created_at": comment.created_at,
                "user_id": comment.user_id,
                "post_id": comment.post_id,
                "replies": PostLogic._get_reply(db, comment.id),
            }
            for comment in comments
        ]

    @staticmethod
    def _get_reply(db: Session, comment_id: int) -> List[dict]:
        replies = db.query(Comment).filter(Comment.parent_comment_id == comment_id).all()
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
