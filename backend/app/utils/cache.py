from typing import Any, Optional
import json
from redis.asyncio import Redis
import logging

logger = logging.getLogger(__name__)

class AsyncCache:
    def __init__(self, redis_url: str = "redis://redis:6379"):
        self.redis = Redis.from_url(redis_url, decode_responses=True)
        self.default_ttl = 3600  # 1 hour default TTL

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            data = await self.redis.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            logger.error(f"Cache get error: {str(e)}")
            return None

    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in cache with optional TTL"""
        try:
            await self.redis.set(
                key,
                json.dumps(value),
                ex=ttl or self.default_ttl
            )
            return True
        except Exception as e:
            logger.error(f"Cache set error: {str(e)}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {str(e)}")
            return False

    async def clear_pattern(self, pattern: str) -> bool:
        """Clear all keys matching pattern"""
        try:
            keys = await self.redis.keys(pattern)
            if keys:
                await self.redis.delete(*keys)
            return True
        except Exception as e:
            logger.error(f"Cache clear pattern error: {str(e)}")
            return False

# Create singleton instance
cache = AsyncCache() 