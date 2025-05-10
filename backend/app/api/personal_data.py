from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..database import get_db
from ..models.models import PersonalData
from ..schemas.schemas import PersonalDataCreate, PersonalDataResponse

router = APIRouter()

@router.get("/", response_model=List[PersonalDataResponse])
async def get_personal_data(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    query = select(PersonalData).offset(skip).limit(limit)
    result = await db.execute(query)
    personal_data = result.scalars().all()
    return personal_data

@router.post("/", response_model=PersonalDataResponse)
async def create_personal_data(data: PersonalDataCreate, db: AsyncSession = Depends(get_db)):
    db_data = PersonalData(**data.dict())
    db.add(db_data)
    await db.commit()
    await db.refresh(db_data)
    return db_data

@router.get("/{data_id}", response_model=PersonalDataResponse)
async def get_personal_data_by_id(data_id: int, db: AsyncSession = Depends(get_db)):
    query = select(PersonalData).where(PersonalData.id == data_id)
    result = await db.execute(query)
    data = result.scalar_one_or_none()
    if data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    return data

@router.put("/{data_id}", response_model=PersonalDataResponse)
async def update_personal_data(data_id: int, data: PersonalDataCreate, db: AsyncSession = Depends(get_db)):
    query = select(PersonalData).where(PersonalData.id == data_id)
    result = await db.execute(query)
    db_data = result.scalar_one_or_none()
    if db_data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    
    for key, value in data.dict().items():
        setattr(db_data, key, value)
    
    await db.commit()
    await db.refresh(db_data)
    return db_data

@router.delete("/{data_id}")
async def delete_personal_data(data_id: int, db: AsyncSession = Depends(get_db)):
    query = select(PersonalData).where(PersonalData.id == data_id)
    result = await db.execute(query)
    db_data = result.scalar_one_or_none()
    if db_data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    
    await db.delete(db_data)
    await db.commit()
    return {"message": "Personal data deleted successfully"} 