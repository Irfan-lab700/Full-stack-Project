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
from fastapi import UploadFile, File, Form
import uuid
import pdfplumber
from models import DocumentChunk,Document, Assignment,Submission
from sentence_transformers import SentenceTransformer
import chromadb
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM
)

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
UPLOAD_FOLDER = "uploads"

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

chroma_client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = chroma_client.get_or_create_collection(
    name="documents"
)

tokenizer = AutoTokenizer.from_pretrained(
    "google/flan-t5-small"
)

model = AutoModelForSeq2SeqLM.from_pretrained(
    "google/flan-t5-small"
)

def retrieve_chunks(query):

    query_embedding = embedding_model.encode(
        query
    ).tolist()

    results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=3
    )

    return results

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
    
class ChatRequest(BaseModel):
    message: str
    
class AssignmentCreate(BaseModel):
    title: str
    description: str
    subject: str
    deadline: str
    
class SubmissionCreate(BaseModel):
    assignment_id: int
    document_id: int


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
        payload = jwt.decode(
            token,
            Secret_key,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")
        role = payload.get("role")

        if username is None:
            return None

        return {
            "username": username,
            "role": role
        }

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
    {"sub": db_user.username,
     "role": db_user.role}
)

    return {
    "success": True,
    "message": "Login successful",
    "access_token": token,
    "data": {
        "username": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    }
}

@app.get("/profile")
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    print("RAW TOKEN =", token)

    user_data = verify_token(token)

    if not user_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {
        "message": "Protected route accessed",
        "username": user_data["username"],
        "role": user_data["role"]
    }
    
@app.post("/chat")
def chat(request: ChatRequest):
    
    user_message = request.message.lower()

    if "hello" in user_message:
        reply = "Hello! I am your AI Project Copilot."

    elif "project" in user_message:
        reply = "Your project is an AI Project Execution Copilot."

    elif "deadline" in user_message:
        reply = "Please check your assigned tasks and deadlines."

    else:
        reply = f"You said: {request.message}"

    return {
        "reply": reply
    }

def create_chunks(
    text: str,
    chunk_size: int = 1000
):
    chunks = []

    for i in range(
        0,
        len(text),
        chunk_size
    ):
        chunks.append(
            text[i:i + chunk_size]
        )

    return chunks
@app.post("/upload-document")
async def upload_document(
    subject: str = Form(...),
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    db = SessionLocal()

    try:

        token = credentials.credentials

        user_data = verify_token(token)

        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        db_user = db.query(DBUser).filter(
            DBUser.username == user_data["username"]
        ).first()

        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Only PDF allowed

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

        # Unique filename

        unique_filename = (
            str(uuid.uuid4())
            + "_"
            + file.filename
        )

        file_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        text = ""

        with pdfplumber.open(file_path) as pdf:

            for page in pdf.pages:

             page_text = page.extract_text()

             if page_text:
               text += page_text + "\n"

        new_document = Document(
        filename=file.filename,
        filepath=file_path,
        subject=subject,
        extracted_text=text,
        uploaded_by=db_user.id
)

        db.add(new_document)
        db.commit()
        db.refresh(new_document)
        
        chunks = create_chunks(text)

        for index, chunk in enumerate(chunks):

            db_chunk = DocumentChunk(
                document_id=new_document.id,
                chunk_index=index,
                chunk_text=chunk
            )
            db.add(db_chunk)
            embedding = embedding_model.encode(
            chunk
            ).tolist()


            collection.add(
              ids=[
               f"{new_document.id}_{index}"
               ],
              documents=[
               chunk
               ],
              embeddings=[
               embedding
              ],
              metadatas=[
            {
                "document_id": new_document.id,
                "subject": subject,
                "uploaded_by": db_user.username
            }
        ]
    )

        db.commit()

        return {
            "message": "File uploaded successfully",
            "document_id": new_document.id,
            "filename": new_document.filename,
            "subject": new_document.subject,
            "uploaded_by": db_user.username,
            "role": db_user.role
        }

    finally:
        db.close()
@app.delete("/documents/{document_id}")
def delete_document(
    document_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    db = SessionLocal()

    try:
        token = credentials.credentials

        user_data = verify_token(token)

        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        document = db.query(Document).filter(
            Document.id == document_id
        ).first()

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        # Delete all chunks first
        chunks = db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document.id
        ).all()

        for chunk in chunks:
            db.delete(chunk)

        db.commit()

        # Delete file from uploads folder
        if os.path.exists(document.filepath):
            os.remove(document.filepath)

        # Delete document
        db.delete(document)
        db.commit()

        return {
            "message": "Document deleted successfully"
        }

    finally:
        db.close()
        
@app.get("/documents")
def get_documents(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    db = SessionLocal()

    try:
        token = credentials.credentials

        user_data = verify_token(token)

        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        documents = db.query(Document).all()

        result = []

        for doc in documents:
            result.append({
                "id": doc.id,
                "filename": doc.filename,
                "subject": doc.subject
            })

        return result

    finally:
        db.close()
        
@app.get("/document/{document_id}")
def get_document(document_id: int):

    db = SessionLocal()

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return {
        "filename": document.filename,
        "subject": document.subject,
        "text": document.extracted_text[:3500]
    }
    
@app.get("/chunks/{document_id}")
def get_chunks(document_id: int):

    db = SessionLocal()

    chunks = db.query(
        DocumentChunk
    ).filter(
        DocumentChunk.document_id
        == document_id
    ).all()

    db.close()

    return chunks
@app.get("/ask")
def ask(query: str):

    results = retrieve_chunks(query)

    return {
        "question": query,
        "documents": results["documents"][0],
        "distances": results["distances"][0]
    }
    
@app.post("/assignments")
def create_assignment(
    assignment: AssignmentCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    db = SessionLocal()

    try:
        token = credentials.credentials

        user_data = verify_token(token)

        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        username = user_data["username"]

        user = db.query(DBUser).filter(
            DBUser.username == username
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        new_assignment = Assignment(
            title=assignment.title,
            description=assignment.description,
            subject=assignment.subject,
            deadline=assignment.deadline,
            created_by=user.id
        )

        db.add(new_assignment)
        db.commit()
        db.refresh(new_assignment)

        return {
            "message": "Assignment created successfully",
            "assignment_id": new_assignment.id
        }

    finally:
        db.close()
        
@app.get("/assignments")
def get_assignments():

    db = SessionLocal()

    try:

        assignments = db.query(
            Assignment
        ).all()

        result = []

        for assignment in assignments:

            result.append({
                "id": assignment.id,
                "title": assignment.title,
                "description": assignment.description,
                "subject": assignment.subject,
                "deadline": assignment.deadline,
                "created_by": assignment.created_by
            })

        return result

    finally:
        db.close()
        
@app.post("/submissions")
def create_submission(
    submission: SubmissionCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    db = SessionLocal()

    try:
        token = credentials.credentials

        user_data = verify_token(token)

        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        username = user_data["username"]

        user = db.query(DBUser).filter(
            DBUser.username == username
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        new_submission = Submission(
            assignment_id=submission.assignment_id,
            document_id=submission.document_id,
            student_id=user.id
        )

        db.add(new_submission)
        db.commit()
        db.refresh(new_submission)

        return {
            "message": "Submission successful",
            "submission_id": new_submission.id
        }

    finally:
        db.close()
        
@app.get("/submissions")
def get_submissions():

    db = SessionLocal()

    try:

        submissions = db.query(
            Submission
        ).all()

        result = []

        for submission in submissions:

            result.append({
                "id": submission.id,
                "assignment_id": submission.assignment_id,
                "student_id": submission.student_id,
                "document_id": submission.document_id
            })

        return result

    finally:
        db.close()
        
@app.get("/my-documents")
def get_my_documents(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    db = SessionLocal()

    try:
        token = credentials.credentials

        user_data = verify_token(token)

        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        username = user_data["username"]

        user = db.query(DBUser).filter(
            DBUser.username == username
        ).first()

        documents = db.query(Document).filter(
            Document.uploaded_by == user.id
        ).all()

        result = []

        for doc in documents:
            result.append({
                "id": doc.id,
                "filename": doc.filename,
                "subject": doc.subject
            })

        return result

    finally:
        db.close()