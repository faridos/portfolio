from sqlalchemy import Column, String, Text, Date, ForeignKey, JSON, Boolean, Integer, DateTime
from .base import BaseModel
from fastapi_admin.models import AbstractAdmin
from sqlalchemy.ext.declarative import declared_attr
from datetime import datetime


class AdminUser(BaseModel):
    __tablename__ = "admin_users"
    
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    last_login = Column(DateTime, nullable=True)
    

class Project(BaseModel):
    __tablename__ = "projects"

    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(JSON, nullable=False)  # List of technologies used
    image_url = Column(String(255))
    github_url = Column(String(255))
    live_url = Column(String(255))
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Experience(BaseModel):
    __tablename__ = "experiences"

    company = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    description = Column(Text, nullable=False)
    location = Column(String(100))
    current = Column(Boolean, default=False)

class PersonalData(BaseModel):
    __tablename__ = "personal_data"

    name = Column(String(100), nullable=False)
    title = Column(String(100), nullable=False)
    bio = Column(Text, nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20))
    location = Column(String(100))
    avatar_url = Column(String(255))
    social_links = Column(JSON)  # Dictionary of social media links
    skills = Column(JSON)  # List of skills 