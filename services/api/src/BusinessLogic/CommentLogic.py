from ..schemas.comment import CommentInput
from ..models.entity.comments import Comment, CommentReply
from datetime import datetime
from sqlalchemy.orm import Session

class CommentLogic:

    @staticmethod
    def create_comment(db: Session, comment: CommentInput) -> Comment:
        try:
            new_comment = Comment(
                content=comment.content,
                user_id=comment.user_id,
                post_id=comment.post_id,
                created_at=datetime.now(datetime.timezone.utc),
            )

            db.add(new_comment)
            db.commit()
            db.refresh(new_comment)

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
                created_at=datetime.now(datetime.timezone.utc),
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
