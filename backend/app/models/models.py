from sqlalchemy import Column, String, Text, Date, ForeignKey, JSON, Boolean, Integer, DateTime
from fastapi_admin.models import AbstractAdmin
from sqlalchemy.ext.declarative import declared_attr
from datetime import datetime
from app.database import Base as BaseModel  # Import Base from app/database.py


class AdminUser(BaseModel):
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    last_login = Column(DateTime, nullable=True)
    

class Project(BaseModel):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(JSON, nullable=False)  # List of technologies used
    image_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    live_url = Column(String(255), nullable=True)
    featured = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Experience(BaseModel):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=False)
    location = Column(String(100), nullable=True)
    current = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class PersonalData(BaseModel):
    __tablename__ = "personal_data"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    title = Column(String(100), nullable=False)
    bio = Column(Text, nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    social_links = Column(JSON, nullable=True)  # Dictionary of social media links
    skills = Column(JSON, nullable=True)  # List of skills
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False) 