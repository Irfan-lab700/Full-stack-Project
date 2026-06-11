from passlib.context import CryptContext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import User as DBUser 
from fastapi import HTTPException
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    email: str
    password: str
    
@app.get("/")
def home():
    return {"message": "Backend running successfully"}

@app.post("/Register")
def register_user(user:User):
    db = SessionLocal()
    existing_user = db.query(DBUser).filter(DBUser.username == user.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = DBUser(
        username = user.username,
        email = user.email,
        password = user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User registered successfully",
        "data": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }

@app.post("/Login")
def login_user():
    return {"message": "User logged in successfully"}
