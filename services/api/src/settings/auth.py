from pydantic_settings import BaseSettings
from passlib.context import CryptContext



class AuthSettings(BaseSettings):
    SECRET_KEY: str = "c8f7f997c8ef198c34aa9731b7c00d388bac7c4ac2085246bd4d884c7410e348ccc7bef3c93014f17f065e51041ede91960abdc26b437867cf5cc576ef204a50"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    @property
    def passlib_context(self) -> CryptContext:
        return CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    
    def hash_password(self, password: str) -> str:
        return self.passlib_context.hash(password)

    