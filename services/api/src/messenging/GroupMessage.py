from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from ..models.entity.group_message import GroupMessage as GroupMessageModel
from ..models.entity.group import Group
from ..models.entity.users import User

class GroupMessage:
    @staticmethod
    def saveMessage(db: Session, message: dict):
        try:
            group_id = message.get("group_id")
            sender_id = message.get("sender_id")
            message_content = message.get("message")
            created_at = message.get("created_at")

            # Find the group by group_id
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise ValueError("Group not found")

            # Find the sender user by sender_id
            sender_user = db.query(User).filter(User.id == sender_id).first()
            if not sender_user:
                raise ValueError("Sender not found")

            # Create a new message
            new_message = GroupMessageModel(
                group_id=group_id,
                sender_id=sender_user.id,  # Assuming sender_id is the user's ID
                message=message_content,
                created_at=created_at
            )

            # Add and commit the new message
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            return new_message

        except SQLAlchemyError as e:
            db.rollback()  # Rollback transaction on error
            print(f"Error saving message: {e}")
            raise  # Re-raise the exception to propagate it up

        except ValueError as e:
            print(f"Error: {e}")
            raise  # Re-raise the exception to propagate it up
