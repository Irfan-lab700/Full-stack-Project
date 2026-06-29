from jose import jwt,JWTError
import os 
from dotenv import load_dotenv
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException,Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import User as DBUser
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import Depends
from database import Base, engine
import models

Base.metadata.create_all(bind=engine)
security = HTTPBearer()
load_dotenv()

Secret_key = os.getenv("SECRET_KEY")
if not Secret_key:
    raise ValueError("SECRET_KEY environment variable is not set")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
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
    
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        Secret_key,
        algorithm=ALGORITHM
    )

    return encoded_jwt
def verify_token(token: str):
    try:
        print("TOKEN =", token)

        payload = jwt.decode(
            token,
            Secret_key,
            algorithms=[ALGORITHM]
        )

        print("PAYLOAD =", payload)

        username = payload.get("sub")

        if username is None:
            return None

        return username

    except JWTError as e:
        print("JWT ERROR =", e)
        return None

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
    token = create_access_token(
    {"sub": db_user.username}
)

    return {
    "success": True,
    "message": "Login successful",
    "access_token": token,
    "data": {
        "username": db_user.username,
        "email": db_user.email
    }
}

@app.get("/profile")
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    print("RAW TOKEN =", token)

    username = verify_token(token)

    if not username:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {
        "message": "Protected route accessed",
        "username": username
    }