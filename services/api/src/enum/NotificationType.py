import enum

class NotificationType(enum.Enum):
    WARNING: str = "warning"
    ERROR: str = "error"
    INFO: str = "info"