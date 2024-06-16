from pydantic_settings import BaseSettings
from pydantic import EmailStr
from dotenv import load_dotenv
import os

load_dotenv()

class EmailSettings(BaseSettings):
    EMAIL_IMAP_USERNAME: EmailStr = os.getenv("EMAIL_IMAP_USERNAME")
    EMAIL_IMAP_PASSWORD: str = os.getenv("EMAIL_IMAP_PASSWORD")
    EMAIL_IMAP_HOST: str = os.getenv("EMAIL_IMAP_HOST")
    EMAIL_IMAP_PORT: int = os.getenv("EMAIL_IMAP_PORT")
    EMAIL_IMAP_SSL: bool = os.getenv("EMAIL_IMAP_SSL")