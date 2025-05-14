from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .base import CRUDBase
from ..models.models import Project
from ..schemas.schemas import ProjectCreate, ProjectUpdate

class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    async def get_by_title(self, db: AsyncSession, *, title: str) -> Optional[Project]:
        query = select(Project).where(Project.title == title)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_featured(self, db: AsyncSession) -> List[Project]:
        query = select(Project).where(Project.featured == True)
        result = await db.execute(query)
        return result.scalars().all()

project = CRUDProject(Project) 