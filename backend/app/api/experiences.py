from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..database import get_db
from ..models.models import Experience
from ..schemas.schemas import ExperienceCreate, ExperienceResponse

router = APIRouter()

@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    query = select(Experience).offset(skip).limit(limit)
    result = await db.execute(query)
    experiences = result.scalars().all()
    return experiences

@router.post("/", response_model=ExperienceResponse)
async def create_experience(experience: ExperienceCreate, db: AsyncSession = Depends(get_db)):
    db_experience = Experience(**experience.dict())
    db.add(db_experience)
    await db.commit()
    await db.refresh(db_experience)
    return db_experience

@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Experience).where(Experience.id == experience_id)
    result = await db.execute(query)
    experience = result.scalar_one_or_none()
    if experience is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience

@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(experience_id: int, experience: ExperienceCreate, db: AsyncSession = Depends(get_db)):
    query = select(Experience).where(Experience.id == experience_id)
    result = await db.execute(query)
    db_experience = result.scalar_one_or_none()
    if db_experience is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    for key, value in experience.dict().items():
        setattr(db_experience, key, value)
    
    await db.commit()
    await db.refresh(db_experience)
    return db_experience

@router.delete("/{experience_id}")
async def delete_experience(experience_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Experience).where(Experience.id == experience_id)
    result = await db.execute(query)
    db_experience = result.scalar_one_or_none()
    if db_experience is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    await db.delete(db_experience)
    await db.commit()
    return {"message": "Experience deleted successfully"} 