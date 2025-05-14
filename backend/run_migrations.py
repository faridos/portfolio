import asyncio
from alembic.config import Config
from alembic import command
from app.config import DATABASE_URL

async def run_migrations():
    # Create Alembic configuration
    alembic_cfg = Config('alembic.ini')
    alembic_cfg.set_main_option('sqlalchemy.url', DATABASE_URL)
    
    # Run migrations
    command.upgrade(alembic_cfg, 'head')

if __name__ == "__main__":
    asyncio.run(run_migrations()) 