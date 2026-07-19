from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Text

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True)
    email = Column(String, unique=True)

    password = Column(String)

    role = Column(String, default="user")

    documents = relationship(
        "Document",
        back_populates="owner"
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    filepath = Column(String)

    subject = Column(String)
    extracted_text = Column(Text)

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
        "User",
        back_populates="documents"
    )
    
class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id")
    )

    chunk_text = Column(Text)

    chunk_index = Column(Integer)
    
    
class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(String)

    description = Column(Text)

    subject = Column(String)

    deadline = Column(String)

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )
class Submission(Base):
    __tablename__ = "submissions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    assignment_id = Column(
        Integer,
        ForeignKey("assignments.id")
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id")
    )