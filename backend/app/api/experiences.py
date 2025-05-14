from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from ..models.models import Experience
from ..schemas.schemas import ExperienceCreate, ExperienceResponse, ExperienceUpdate
from ..crud.experience import experience

router = APIRouter()

@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await experience.get_multi(db, skip=skip, limit=limit)

@router.get("/current", response_model=List[ExperienceResponse])
async def get_current_experiences(db: AsyncSession = Depends(get_db)):
    return await experience.get_current(db)

@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: int, db: AsyncSession = Depends(get_db)):
    db_experience = await experience.get(db, id=experience_id)
    if db_experience is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_experience

@router.post("/", response_model=ExperienceResponse)
async def create_experience(
    experience_in: ExperienceCreate,
    db: AsyncSession = Depends(get_db)
):
    return await experience.create(db, obj_in=experience_in)

@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    experience_in: ExperienceUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_experience = await experience.get(db, id=experience_id)
    if db_experience is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    return await experience.update(db, db_obj=db_experience, obj_in=experience_in)

@router.delete("/{experience_id}")
async def delete_experience(experience_id: int, db: AsyncSession = Depends(get_db)):
    db_experience = await experience.get(db, id=experience_id)
    if db_experience is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    await experience.remove(db, id=experience_id)
    return {"message": "Experience deleted successfully"} 