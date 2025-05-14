from app.database import AsyncSessionLocal
from app.models.models import AdminUser
import asyncio
from sqlalchemy import select, text
from passlib.context import CryptContext
import time
from app.config import DATABASE_URL  # Import DATABASE_URL

# Add a delay

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin_user():
    async with AsyncSessionLocal() as session:
        
        print(f"DATABASE_URL in create_admin.py: {DATABASE_URL}")  # Print DATABASE_URL

        # Check if admin user already exists
        query = text("SELECT * FROM admin_users WHERE username = 'admin'")
        result = await session.execute(query)
        admin = result.first()
        
        if not admin:
            # Create admin user
            admin_user = AdminUser(
                username="admin",
                hashed_password=pwd_context.hash("admin123"),  # Note: using hashed_password field
                email="admin@example.com"
            )
            session.add(admin_user)
            await session.commit()
            print("Admin user created successfully!")
            query = text("SELECT * FROM admin_users WHERE username = 'admin'")
            result = await session.execute(query)
            admin = result.first()
        else:
            print("Admin user already exists!")

if __name__ == "__main__":
    time.sleep(5)
    asyncio.run(create_admin_user()) 