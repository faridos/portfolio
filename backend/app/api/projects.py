from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from ..models.models import Project
from ..schemas.schemas import ProjectCreate, ProjectResponse, ProjectUpdate
from ..crud.project import project

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await project.get_multi(db, skip=skip, limit=limit)

@router.get("/featured", response_model=List[ProjectResponse])
async def get_featured_projects(db: AsyncSession = Depends(get_db)):
    return await project.get_featured(db)

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    db_project = await project.get(db, id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    return await project.create(db, obj_in=project_in)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_project = await project.get(db, id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return await project.update(db, db_obj=db_project, obj_in=project_in)

@router.delete("/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    db_project = await project.get(db, id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    await project.remove(db, id=project_id)
    return {"message": "Project deleted successfully"} 