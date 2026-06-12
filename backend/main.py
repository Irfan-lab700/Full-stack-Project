from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import User as DBUser

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

class Login(BaseModel):
    email: str
    password: str


@app.get("/")
def home():
    return {"message": "Backend running successfully"}

@app.post("/Register")
def register_user(user: User):
    db = SessionLocal()

    existing_user = db.query(DBUser).filter(DBUser.username == user.username).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    if not all([user.username, user.email, user.password]):
        db.close()
        raise HTTPException(status_code=400, detail="All fields required")

    hashed_password = pwd_context.hash(user.password)

    new_user = DBUser(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "User registered successfully",
        "data": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }

@app.post("/Login")
def login_user(user: Login):
    db = SessionLocal()

    db_user = db.query(DBUser).filter(DBUser.email == user.email).first()

    if not db_user:
        db.close()
        return {"success": False, "message": "User not found"}

    if not pwd_context.verify(user.password, db_user.password):
        db.close()
        return {"success": False, "message": "Incorrect password"}

    db.close()

    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "username": db_user.username,
            "email": db_user.email
        }
    }
