from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp, Receive, Scope, Send
from fastapi import FastAPI, Request
import time

class Middleware(BaseHTTPMiddleware):
    pass
