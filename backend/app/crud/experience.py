from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .base import CRUDBase
from ..models.models import Experience
from ..schemas.schemas import ExperienceCreate, ExperienceUpdate

class CRUDExperience(CRUDBase[Experience, ExperienceCreate, ExperienceUpdate]):
    async def get_by_company(self, db: AsyncSession, *, company: str) -> Optional[Experience]:
        query = select(Experience).where(Experience.company == company)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_current(self, db: AsyncSession) -> List[Experience]:
        query = select(Experience).where(Experience.current == True)
        result = await db.execute(query)
        return result.scalars().all()

experience = CRUDExperience(Experience) 