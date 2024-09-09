from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from fastapi import HTTPException, status, Request
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Page
from ..models.entity.comments import Comment, CommentReply
from ..models.entity.users import User
from ..schemas.comment import *
from datetime import datetime
from ..models.entity.post import Post
from ..models.entity.user_profile import UserProfile


class CommentLogic:

    @staticmethod
    def get_comments(db: Session, post_id: int, request: Request, user: User) -> Page[CommentSchma]:
        try:
            # コメントのクエリ
            query = (
                db.query(
                    Comment.id,
                    Comment.content,
                    Comment.created_at,
                    Comment.post_id,
                    func.concat(UserProfile.first_name, ' ', UserProfile.last_name).label('username'),
                    UserProfile.profile_picture
                )
                .join(UserProfile, Comment.user_id == UserProfile.user_id)
                .filter(Comment.post_id == post_id)
                .order_by(desc(Comment.created_at))
            )

            # ページネーション
            paginated_comments = paginate(db, query)

            # 各コメントの処理
            processed_comments = []
            for comment in paginated_comments.items:
                comment_dict = {
                    "id": comment.id,
                    "content": comment.content,
                    "created_at": comment.created_at,
                    "post_id": comment.post_id,
                    "user": {
                        "username": comment.username,
                        "profile_picture": str(request.url_for('static', path=comment.profile_picture)) 
                        if comment.profile_picture else None,
                    },
                    "replies": []
                }

                # 返事を取得
                comment_replies = (
                    db.query(
                        CommentReply.id,
                        CommentReply.content,
                        CommentReply.created_at,
                        CommentReply.post_id,
                        func.concat(UserProfile.first_name, ' ', UserProfile.last_name).label('username'),
                        UserProfile.profile_picture
                    )
                    .join(UserProfile, CommentReply.user_id == UserProfile.user_id)
                    .filter(CommentReply.parent_comment_id == comment.id)
                    .order_by(desc(CommentReply.created_at))
                    .all()
                )

                for reply in comment_replies:
                    comment_dict["replies"].append(
                        {
                            "id": reply.id,
                            "content": reply.content,
                            "created_at": reply.created_at,
                            "post_id": reply.post_id,
                            "user": {
                                "username": reply.username,
                                "profile_picture": str(request.url_for('static', path=reply.profile_picture)) 
                                if reply.profile_picture else None,
                            },
                        }
                    )

                processed_comments.append(comment_dict)

            paginated_comments.items = processed_comments

            return paginated_comments

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    @staticmethod
    def create_comment(db: Session, comment: CommentInput, user: User) -> Comment:
        try:

            # Check if the post exists
            post = db.query(Post).filter(Post.id == comment.post_id).first()
            if not post:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
            
            new_comment = Comment(
                content=comment.content,
                user_id=user.id,
                post_id=comment.post_id,
                created_at=datetime.now(),
            )

            # 
            db.add(new_comment)
            db.commit()
            db.refresh(new_comment)

            # Update the post's total_likes
            post.total_comments += 1
            db.commit()
            db.refresh(post)

            return new_comment

        except Exception as e:
            raise e

    @staticmethod
    def delete_comment(db: Session, comment_id: int, user_id: int) -> None:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()

        if comment.user_id != user_id:
            raise Exception("Unauthorized")

        if comment is None:
            raise Exception("Comment not found")

        db.delete(comment)
        db.commit()

    @staticmethod
    def create_comment_reply(db: Session, comment_reply: CommentInput) -> Comment:
        try:
            new_comment_reply = CommentReply(
                content=comment_reply.content,
                user_id=comment_reply.user_id,
                post_id=comment_reply.post_id,
                parent_comment_id=comment_reply.comment_id,
                created_at=datetime.now(),

            )

            db.add(new_comment_reply)
            db.commit()
            db.refresh(new_comment_reply)

            return new_comment_reply

        except Exception as e:
            raise e

    @staticmethod
    def delete_comment_reply(db: Session, comment_reply_id: int, user_id: int) -> None:
        comment_reply = (
            db.query(CommentReply).filter(CommentReply.id == comment_reply_id).first()
        )

        if comment_reply.user_id != user_id:
            raise Exception("Unauthorized")

        if comment_reply is None:
            raise Exception("Comment reply not found")

        db.delete(comment_reply)
        db.commit()
