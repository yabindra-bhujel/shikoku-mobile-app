from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import logging

class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, logger: logging.Logger):
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request: Request, call_next):
        # リクエストのログを記録
        self.logger.info(f"Request: {request.method} {request.url}")

        # リクエストを処理
        response = await call_next(request)

        # レスポンスのログを記録
        self.logger.info(f"Response: {response.status_code}")

        return response
