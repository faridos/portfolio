import asyncio
from app.database import engine
from app.models.models import BaseModel, Project, Experience, PersonalData, AdminUser

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    print("Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_db()) 