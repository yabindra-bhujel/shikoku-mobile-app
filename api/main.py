from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from src.models.database import SessionLocal, engine, Base
from src.models.entity.items import Items
from pydantic import BaseModel 

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
