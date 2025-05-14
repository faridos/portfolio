from typing import Dict, Optional
import time
import asyncio
from fastapi import HTTPException, Request
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = {}
        self.lock = asyncio.Lock()

    async def is_rate_limited(self, key: str) -> bool:
        """Check if a request should be rate limited"""
        async with self.lock:
            now = time.time()
            minute_ago = now - 60

            # Clean up old requests
            if key in self.requests:
                self.requests[key] = [t for t in self.requests[key] if t > minute_ago]
            else:
                self.requests[key] = []

            # Check if rate limit exceeded
            if len(self.requests[key]) >= self.requests_per_minute:
                return True

            # Add new request
            self.requests[key].append(now)
            return False

    async def get_remaining_requests(self, key: str) -> int:
        """Get number of remaining requests in the current window"""
        async with self.lock:
            now = time.time()
            minute_ago = now - 60

            if key in self.requests:
                self.requests[key] = [t for t in self.requests[key] if t > minute_ago]
                return self.requests_per_minute - len(self.requests[key])
            return self.requests_per_minute

# Create singleton instance
rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request) -> None:
    """Middleware to handle rate limiting"""
    client_ip = request.client.host
    if await rate_limiter.is_rate_limited(client_ip):
        remaining = await rate_limiter.get_remaining_requests(client_ip)
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Too many requests",
                "retry_after": 60,
                "remaining_requests": remaining
            }
        ) 