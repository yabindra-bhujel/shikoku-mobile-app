from exponent_server_sdk import PushClient, PushMessage, PushServerError, DeviceNotRegisteredError, PushTicketError
from requests.exceptions import ConnectionError, HTTPError
import logging
from sqlalchemy.orm import Session as DatabaseSession
from ..models.entity.notification_token import ExpoToken
from ..models.entity.post import Post
from ..models.entity.users import User
from ..models.entity.application_settings import ApplicationSetting

class PushNotificationService:
    def __init__(self, db: DatabaseSession, rollbar_client=None, session=None) -> None:
        self.db = db
        self.rollbar_client = rollbar_client
        self.session = session or PushClient()

    def send_post_created_notification(self, post: Post) -> None:
        notification_tokens = self._get_all_user_notification_token(self.db)
        if not notification_tokens:
            return
        
        title = "New Post Created."
        message = f"{post.user.user_profile.first_name} {post.user.user_profile.last_name} created a new post."
        extra = {
            "post_id": post.id,
            "user_id": post.user.id,
            "type": "post",
            "url": f"/post/{post.id}"
        }

        self._send_notifications(notification_tokens, title, message, extra)

    def send_group_message_notification(self, notification_tokens: list, message: str, title: str, extra: dict=None) -> None:
        if not notification_tokens:
            return
        self._send_notifications(notification_tokens, title, message, extra)

    def _send_notifications(self, notification_tokens: list, title: str, message: str, extra: dict) -> None:
        messages = [
            PushMessage(
                to=token,
                title=title,
                body=message,
                data=extra,
                sound="default"
            )
            for token in notification_tokens
        ]

        try:
            responses = self.session.publish_multiple(messages)
            for response in responses:
                response.validate_response()

        except PushServerError as exc:
            logging.error(f"PushServerError encountered: {exc}")
            self._report_error(exc, notification_tokens, message, extra)
            raise

        except (ConnectionError, HTTPError) as exc:
            logging.error(f"Network error encountered: {exc}")
            self._report_error(exc, notification_tokens, message, extra)
            raise

        except DeviceNotRegisteredError as exc:
            logging.info("Device not registered, deactivating tokens.")
            for token in notification_tokens:
                self.deactivate_token(token)

        except PushTicketError as exc:
            logging.error(f"PushTicketError encountered: {exc}")
            self._report_error(exc, notification_tokens, message, extra)
            raise

    def deactivate_token(self, token: str) -> None:
        self.db.query(ExpoToken).filter(ExpoToken.token == token).update({"is_active": False})
        self.db.commit()

    def _report_error(self, exc: Exception, tokens: list, message: str, extra: dict) -> None:
        if self.rollbar_client:
            self.rollbar_client.report_exc_info(
                extra_data={
                    'tokens': tokens,
                    'message': message,
                    'extra': extra,
                    'errors': getattr(exc, 'errors', None),
                    'response_data': getattr(exc, 'response_data', None),
                }
            )

    def _get_all_user_notification_token(self, db: DatabaseSession) -> list:
        query = (
            db.query(ExpoToken.token)
            .join(User, User.id == ExpoToken.user_id)
            .join(ApplicationSetting, ApplicationSetting.user_id == User.id)
            .filter(User.is_active == True)
            .filter(ExpoToken.is_active == True)
            .filter(ApplicationSetting.is_post_notification_enabled == True)
            .all()
        )
        return [token[0] for token in query]