import logging
from logging.handlers import RotatingFileHandler

def setup_logging(log_path: str = "dev.log") -> logging.Logger:
    logger = logging.getLogger("uvicorn")
    logger.setLevel(logging.INFO)

    # ログのフォーマット
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # ログファイルの設定
    file_handler = RotatingFileHandler(log_path, maxBytes=10485760, backupCount=3)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger
