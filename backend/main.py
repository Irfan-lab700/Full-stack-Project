from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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
    return {"message": "User registered successfully",
            "data": user}

@app.post("/Login")
def login_user():
    return {"message": "User logged in successfully"}
