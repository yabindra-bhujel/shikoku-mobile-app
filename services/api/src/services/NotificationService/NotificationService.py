from .NotificationConnectionManager import NotificationConnectionManager

class NotificationService:
    
    def __init__(self) -> None:
        pass

    def create_notification(self, username: str, data: dict) -> None:
        notification_manager = NotificationConnectionManager()
        try:
            notification_manager.send_notification(username=username, data=data)
        except Exception as e:
            print(e)
            return False


