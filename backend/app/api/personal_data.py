from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from ..models.models import PersonalData
from ..schemas.schemas import PersonalDataCreate, PersonalDataResponse, PersonalDataUpdate
from ..crud.personal_data import personal_data

router = APIRouter()

@router.get("/", response_model=List[PersonalDataResponse])
async def get_personal_data(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await personal_data.get_multi(db, skip=skip, limit=limit)

@router.get("/first", response_model=PersonalDataResponse)
async def get_first_personal_data(db: AsyncSession = Depends(get_db)):
    db_data = await personal_data.get_first(db)
    if db_data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    return db_data

@router.get("/{data_id}", response_model=PersonalDataResponse)
async def get_personal_data_by_id(data_id: int, db: AsyncSession = Depends(get_db)):
    db_data = await personal_data.get(db, id=data_id)
    if db_data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    return db_data

@router.post("/", response_model=PersonalDataResponse)
async def create_personal_data(
    data_in: PersonalDataCreate,
    db: AsyncSession = Depends(get_db)
):
    return await personal_data.create(db, obj_in=data_in)

@router.put("/{data_id}", response_model=PersonalDataResponse)
async def update_personal_data(
    data_id: int,
    data_in: PersonalDataUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_data = await personal_data.get(db, id=data_id)
    if db_data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    return await personal_data.update(db, db_obj=db_data, obj_in=data_in)

@router.delete("/{data_id}")
async def delete_personal_data(data_id: int, db: AsyncSession = Depends(get_db)):
    db_data = await personal_data.get(db, id=data_id)
    if db_data is None:
        raise HTTPException(status_code=404, detail="Personal data not found")
    await personal_data.remove(db, id=data_id)
    return {"message": "Personal data deleted successfully"} 