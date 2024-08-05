import json
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# ログミドルウェア
class LogRequestsMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, logger: logging.Logger):
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request: Request, call_next):
        # 全ての HTTP リクエストをログに記録
        request_info = {
            "method": request.method,
            "url": request.url.path,
            "client": request.client.host,
        }

        # ログに記録
        self.logger.info(f"Request: {json.dumps(request_info, indent=2)}")

        # リクエストを処理
        response = await call_next(request)
        return response