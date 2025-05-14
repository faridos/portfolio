from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .base import CRUDBase
from ..models.models import PersonalData
from ..schemas.schemas import PersonalDataCreate, PersonalDataUpdate

class CRUDPersonalData(CRUDBase[PersonalData, PersonalDataCreate, PersonalDataUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[PersonalData]:
        query = select(PersonalData).where(PersonalData.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_first(self, db: AsyncSession) -> Optional[PersonalData]:
        query = select(PersonalData).limit(1)
        result = await db.execute(query)
        return result.scalar_one_or_none()

personal_data = CRUDPersonalData(PersonalData) 