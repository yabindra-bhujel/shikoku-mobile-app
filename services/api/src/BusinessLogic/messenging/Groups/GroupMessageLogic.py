from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.sql import func
from typing import List
from sqlalchemy import or_
from src.models.entity.group_message import GroupMessage as GroupMessageModel
from src.models.entity.group import Group
from src.models.entity.users import User
from ....schemas.GroupMessageSchema import GroupMessageSchema
from ....models.entity.user_profile import UserProfile
from ....models.entity.notification_token import ExpoToken
from ....models.entity.application_settings import ApplicationSetting
from ....services.PushNotificationService import PushNotificationService

class GroupMessageLogic:

    @classmethod
    def get_user_notifcation_token(cls, db: Session, group_id: int) -> List[str]:
        try:
            tokens = (
                db.query(ExpoToken.token)
                .join(User, User.id == ExpoToken.user_id)
                .join(ApplicationSetting, ApplicationSetting.user_id == User.id)
                .filter(User.is_active == True)
                .filter(ExpoToken.is_active == True)
                .filter(ApplicationSetting.is_message_notification_enabled == True)
                .join(Group, or_(Group.admin_id == User.id, Group.group_members.any(User.id == User.id)))
                .filter(Group.id == group_id)
                .all()
            )
            notification_tokens = [token[0] for token in tokens]

            return notification_tokens

        except SQLAlchemyError as e:
            db.rollback()
            raise e

    @staticmethod
    def saveMessage(db: Session, message: dict) -> GroupMessageModel:
        try:
            group_id = message.get("group_id")
            sender_id = message.get("sender_id")
            message_content = message.get("message")

            # グールプが存在するか確認
            group = db.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise ValueError("Group not found")

            # 送信者が存在するか確認
            sender_user = db.query(User).filter(User.id == sender_id).first()
            if not sender_user:
                raise ValueError("Sender not found")
            
            '''
            グループメッセージの通知を送信する
            '''
            notitication_message = f"{sender_user.user_profile.first_name} {sender_user.user_profile.last_name}: {message_content}"
            titile = f"New Message in {group.name}"

            #TODO: 通知の追加データを追加
            extra_data = {
                "group_id": group_id,
                "sender_id": sender_id,
                "message": message_content,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "url": f"/group/{group_id}"
            }
        
            # 通知を送信するための通知トークンを取得
            notification_tokens = GroupMessageLogic.get_user_notifcation_token(db, group_id)
            push_notification_service = PushNotificationService(db)
            if notification_tokens:
                push_notification_service.send_group_message_notification(notification_tokens, notitication_message, titile, extra_data)
            

            '''
            メッセージをデータベースに保存する
            '''

            new_message = GroupMessageModel(
                group_id=group_id,
                sender_id=sender_user.id,
                message=message_content,
                created_at=datetime.now(),
            )

            # メッセージを保存
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            return new_message
        
        except SQLAlchemyError as e:
            db.rollback()
            raise e
        
        except Exception as e:
            raise e
        
    # グループIDを指定してメッセージを取得
    @staticmethod
    def getMessages(db: Session, group_id: int) -> GroupMessageSchema:
        try:
            query = (db.query(
                    GroupMessageModel.id,
                    GroupMessageModel.group_id,
                    GroupMessageModel.sender_id,
                    GroupMessageModel.message,
                    GroupMessageModel.created_at,
                    # last name と first name を結合して username として取得
                    func.concat(UserProfile.first_name, ' ', UserProfile.last_name).label('username'))
                .join(UserProfile, GroupMessageModel.sender_id == UserProfile.user_id)
                .filter(GroupMessageModel.group_id == group_id)
                .order_by(GroupMessageModel.created_at.desc())
                )
            
            # ページネーションは 自動で行われる
            messages = paginate(db, query)

            return messages

        except SQLAlchemyError as e:
            db.rollback()
            raise e

    # メッセージIDを指定してメッセージを削除
    @staticmethod
    def deleteMessage(db: Session, message_id: int, user_id: int):
        try:
            message = (
                db.query(GroupMessageModel)
                .filter(GroupMessageModel.id == message_id)
                .first()
            )

            # 自分の ID でない場合は削除できない
            if message.sender_id != user_id:
                raise ValueError("You are not allowed to delete this message")
            if not message:
                raise ValueError("Message not found")
            db.delete(message)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise e
