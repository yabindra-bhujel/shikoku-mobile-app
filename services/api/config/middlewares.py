import json
import logging
from fastapi import Request, Response, Depends
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable
from src.auth.logic import AuthLogic
from src.models.database import get_db
from sqlalchemy.orm import Session
from src.settings.auth import AuthSettings
from datetime import timedelta

class TokenHandlingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, logger: logging.Logger):
        super().__init__(app)
        self.logger = logger
        self.auth_logic = AuthLogic(logger=logger)
        self.auth_settings = AuthSettings()

    async def dispatch(self, request: Request, call_next: Callable[[Request], Response]) -> Response:
        db: Session = next(get_db())
        
        # try:
        response = await call_next(request)
        #     cookies = request.cookies
        #     refresh_token = cookies.get("refresh_token")


        #     if refresh_token is not None:
        #         token = self.auth_logic.verify_token(refresh_token)

        #         if token:
        #             user_id = int(token["sub"])
        #             user = self.auth_logic.get_user_by_user_id(db, user_id)

        #             if user:
        #                 new_access_token = self.auth_logic.create_access_token(
        #                     username=user.username,
        #                     user_id=user_id,
        #                     email=user.email,
        #                     role=user.role,
        #                     expires_delta=timedelta(minutes=self.auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        #                 )

        #                 response.set_cookie(
        #                     key="access_token", 
        #                     value=new_access_token, 
        #                     max_age=self.auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        #                 )

        #                 response.set_cookie(
        #                     key="refresh_token", 
        #                     value=refresh_token, 
        #                     max_age=self.auth_settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        #                 )
        # finally:
        #     db.close()

        return response
