from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..utils.db_monitor import get_db_stats
from ..models.models import AdminUser
from ..auth import authenticate_admin

router = APIRouter()

@router.get("/db-stats")
async def get_database_stats(
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(authenticate_admin)
):
    """
    Get database performance statistics.
    Only accessible by admin users.
    """
    return get_db_stats() 