# logging_config.py
import json
import logging
import os

LOG_DIRECTORY = os.path.join(os.path.dirname(__file__), "var", "log")
if not os.path.exists(LOG_DIRECTORY):
    os.makedirs(LOG_DIRECTORY)

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'message': record.getMessage(),
            'logger': record.name
        }
        return json.dumps(log_record)

def setup_logging():
    log_file = os.path.join(LOG_DIRECTORY, "app.log")
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(JSONFormatter())

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(file_handler)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(console_handler)

    return logger
