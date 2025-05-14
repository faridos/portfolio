from app.database import engine
from app.models.base import Base
from app.models.models import AdminUser, Project, Experience, PersonalData
import asyncio

async def init_db():
    async with engine.begin() as conn:
        # Drop all tables first
        print(Base.metadata.tables.keys()) 
        await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_db()) 