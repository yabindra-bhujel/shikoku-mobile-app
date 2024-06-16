from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from src.settings.auth import AuthSettings
from jose import jwt, JWTError
from datetime import datetime
from fastapi.responses import PlainTextResponse


class CustomMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        auth_settings = AuthSettings()
        self.secret_key = auth_settings.SECRET_KEY
        self.algorithm = auth_settings.ALGORITHM
        self.excluded_paths = ["/auth", "/auth/token", "/docs", "/redoc"]


    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.excluded_paths:
            response = await call_next(request)
            return response
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token_type, token = auth_header.split(" ")
                if token_type.lower() == 'bearer':
                    payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])

                    if datetime.utcnow() > datetime.fromtimestamp(payload['exp']):
                        raise JWTError('Token has expired')
                
                    response = await call_next(request)
                    return response
                
            except (ValueError, JWTError) as e:
                response = PlainTextResponse("Unauthorized: Invalid token", status_code=401)
                return response
            
        response = PlainTextResponse("Unauthorized: Missing token", status_code=401)
        return response
