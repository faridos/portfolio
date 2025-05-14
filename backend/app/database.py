from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import logging
from .config import DATABASE_URL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create async engine with optimized connection pooling
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True only for debugging
    future=True,
    # Optimized connection pooling settings
    #pool_size=5,  # Reduced for portfolio app (lower concurrent users)
    #max_overflow=5,  # Reduced overflow for better resource management
    #pool_timeout=20,  # Reduced timeout for faster failure detection
    #pool_recycle=3600,  # Recycle connections every hour
    #pool_pre_ping=True,  # Enable connection health checks
    # Performance optimizations
    #pool_use_lifo=True,  # Use Last-In-First-Out for better connection reuse
    #echo_pool=True,  # Log pool events
)

# Create async session factory with optimized settings
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Prevent expired object access
    autocommit=False,
    autoflush=False,
)

# Create Base class
Base = declarative_base()

# Dependency to get DB session with connection monitoring
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close() 