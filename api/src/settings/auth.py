from pydantic_settings import BaseSettings
from passlib.context import CryptContext



class AuthSettings(BaseSettings):
    SECRET_KEY: str = "fwq82"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    @property
    def passlib_context(self) -> CryptContext:
        return CryptContext(schemes=["bcrypt"], deprecated="auto")
