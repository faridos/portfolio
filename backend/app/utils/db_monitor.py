import time
import logging
from functools import wraps
from typing import Callable, Any
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

class DatabaseMonitor:
    def __init__(self):
        self.query_times = []
        self.total_queries = 0
        self.failed_queries = 0

    def log_query_time(self, query_time: float):
        self.query_times.append(query_time)
        self.total_queries += 1

    def log_failed_query(self):
        self.failed_queries += 1

    def get_stats(self) -> dict:
        if not self.query_times:
            return {
                "total_queries": self.total_queries,
                "failed_queries": self.failed_queries,
                "avg_query_time": 0,
                "min_query_time": 0,
                "max_query_time": 0
            }
        
        return {
            "total_queries": self.total_queries,
            "failed_queries": self.failed_queries,
            "avg_query_time": sum(self.query_times) / len(self.query_times),
            "min_query_time": min(self.query_times),
            "max_query_time": max(self.query_times)
        }

# Create a singleton instance
db_monitor = DatabaseMonitor()

def monitor_db_operation(func: Callable) -> Callable:
    @wraps(func)
    async def wrapper(*args, **kwargs) -> Any:
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            query_time = time.time() - start_time
            db_monitor.log_query_time(query_time)
            
            # Log slow queries
            if query_time > 1.0:  # Log queries taking more than 1 second
                logger.warning(f"Slow query detected in {func.__name__}: {query_time:.2f} seconds")
            
            return result
        except Exception as e:
            db_monitor.log_failed_query()
            logger.error(f"Database operation failed in {func.__name__}: {str(e)}")
            raise
    return wrapper

def get_db_stats() -> dict:
    """Get current database statistics"""
    return db_monitor.get_stats() 