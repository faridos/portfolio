import sys
print(sys.executable)
from fastapi import FastAPI, Response, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import os
from dotenv import load_dotenv
from typing import List
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime

from .database import AsyncSessionLocal
from .models.models import AdminUser, Project as ProjectModel, Experience as ExperienceModel, PersonalData as PersonalDataModel
from .schemas.schemas import (
    Project, ProjectCreate, ProjectResponse,
    Experience, ExperienceCreate, ExperienceResponse,
    PersonalData, PersonalDataCreate, PersonalDataResponse
)
from .auth import authenticate_admin
from .api import upload

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")

# Create FastAPI app
app = FastAPI(title="Portfolio API", version="1.0.0")

# Get the absolute path to the static directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "app", "static")

# Mount static files with absolute path
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Templates
templates = Jinja2Templates(directory="app/templates")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Admin Dashboard
@app.get("/admin", response_class=Response)
async def admin_dashboard(request: Request, admin: AdminUser = Depends(authenticate_admin)):
    return templates.TemplateResponse("admin/dashboard.html", {"request": request})

@app.get("/admin/projects", response_class=Response)
async def projects_page(request: Request, admin: AdminUser = Depends(authenticate_admin)):
    return templates.TemplateResponse("admin/projects.html", {"request": request})

@app.get("/admin/experiences", response_class=Response)
async def experiences_page(request: Request, admin: AdminUser = Depends(authenticate_admin)):
    return templates.TemplateResponse("admin/experiences.html", {"request": request})

@app.get("/admin/personal", response_class=Response)
async def personal_page(request: Request, admin: AdminUser = Depends(authenticate_admin)):
    return templates.TemplateResponse("admin/personal.html", {"request": request})

# Admin API Routes
@app.get("/api/admin/projects", response_model=List[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ProjectModel))
    return result.scalars().all()

@app.get("/api/admin/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/api/admin/projects", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    db_project = ProjectModel(**project.model_dump())
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

@app.put("/api/admin/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project: ProjectCreate, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    db_project = result.scalar_one_or_none()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    
    await db.commit()
    await db.refresh(db_project)
    return db_project

@app.delete("/api/admin/projects/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    db_project = result.scalar_one_or_none()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(db_project)
    await db.commit()
    return {"message": "Project deleted successfully"}

# Experience API Routes
@app.get("/api/admin/experiences", response_model=List[ExperienceResponse])
async def list_experiences(db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ExperienceModel))
    return result.scalars().all()

@app.get("/api/admin/experiences/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: int, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ExperienceModel).where(ExperienceModel.id == experience_id))
    experience = result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience

@app.post("/api/admin/experiences", response_model=ExperienceResponse)
async def create_experience(experience: ExperienceCreate, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    db_experience = ExperienceModel(**experience.model_dump())
    db.add(db_experience)
    await db.commit()
    await db.refresh(db_experience)
    return db_experience

@app.put("/api/admin/experiences/{experience_id}", response_model=ExperienceResponse)
async def update_experience(experience_id: int, experience: ExperienceCreate, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ExperienceModel).where(ExperienceModel.id == experience_id))
    db_experience = result.scalar_one_or_none()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    for key, value in experience.model_dump().items():
        setattr(db_experience, key, value)
    
    await db.commit()
    await db.refresh(db_experience)
    return db_experience

@app.delete("/api/admin/experiences/{experience_id}")
async def delete_experience(experience_id: int, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(ExperienceModel).where(ExperienceModel.id == experience_id))
    db_experience = result.scalar_one_or_none()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    await db.delete(db_experience)
    await db.commit()
    return {"message": "Experience deleted successfully"}

# Public endpoint for personal data
@app.get("/api/personal", response_model=PersonalDataResponse)
async def get_public_personal_data(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PersonalDataModel))
    data = result.scalar_one_or_none()
    
    if not data:
        # Return default data if none exists
        return PersonalDataResponse(
            id=0,
            name="",
            title="",
            bio="",
            email="",
            phone="",
            location="",
            avatar_url="",
            social_links={},
            skills=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    return data

# Admin endpoint for personal data
@app.get("/api/admin/personal", response_model=PersonalDataResponse)
async def get_admin_personal_data(db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    result = await db.execute(select(PersonalDataModel))
    data = result.scalar_one_or_none()
    
    if not data:
        # Return default data if none exists
        return PersonalDataResponse(
            id=0,
            name="",
            title="",
            bio="",
            email="",
            phone="",
            location="",
            avatar_url="",
            social_links={},
            skills=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    return data

@app.post("/api/admin/personal", response_model=PersonalDataResponse)
async def create_personal_data(data: PersonalDataCreate, db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(authenticate_admin)):
    # Check if personal data already exists
    result = await db.execute(select(PersonalDataModel))
    existing_data = result.scalar_one_or_none()
    
    if existing_data:
        # Update existing data
        for key, value in data.model_dump().items():
            setattr(existing_data, key, value)
        existing_data.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(existing_data)
        return existing_data
    else:
        # Create new data
        db_data = PersonalDataModel(**data.model_dump())
        db.add(db_data)
        await db.commit()
        await db.refresh(db_data)
        return db_data

# Import and include API routers
from app.api import projects, experiences, personal_data

app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(experiences.router, prefix="/api/experiences", tags=["experiences"])
app.include_router(personal_data.router, prefix="/api/personal", tags=["personal"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])

@app.get("/")
def root():
    return {"message": "Welcome to Portfolio API"}

@app.get("/test-cors")
def test_cors(response: Response):
    response.headers["X-Test-Header"] = "test-value"
    return {
        "message": "CORS test endpoint",
        "headers": dict(response.headers)
    } 