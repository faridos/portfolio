import asyncio
from typing import Any, Callable, Dict, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class BackgroundTaskManager:
    def __init__(self):
        self.tasks: Dict[str, asyncio.Task] = {}
        self.task_results: Dict[str, Any] = {}
        self.task_status: Dict[str, str] = {}

    async def add_task(
        self,
        task_id: str,
        func: Callable,
        *args,
        **kwargs
    ) -> str:
        """Add a new background task"""
        if task_id in self.tasks:
            raise ValueError(f"Task {task_id} already exists")

        self.task_status[task_id] = "pending"
        
        async def task_wrapper():
            try:
                self.task_status[task_id] = "running"
                result = await func(*args, **kwargs)
                self.task_results[task_id] = result
                self.task_status[task_id] = "completed"
            except Exception as e:
                self.task_status[task_id] = "failed"
                self.task_results[task_id] = str(e)
                logger.error(f"Background task {task_id} failed: {str(e)}")
            finally:
                # Clean up after 1 hour
                await asyncio.sleep(3600)
                if task_id in self.tasks:
                    del self.tasks[task_id]
                if task_id in self.task_results:
                    del self.task_results[task_id]
                if task_id in self.task_status:
                    del self.task_status[task_id]

        self.tasks[task_id] = asyncio.create_task(task_wrapper())
        return task_id

    def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Get status of a background task"""
        if task_id not in self.tasks:
            return {"status": "not_found"}
        
        return {
            "status": self.task_status.get(task_id, "unknown"),
            "result": self.task_results.get(task_id),
            "running": not self.tasks[task_id].done()
        }

    def get_all_tasks(self) -> List[Dict[str, Any]]:
        """Get status of all background tasks"""
        return [
            {
                "task_id": task_id,
                "status": self.task_status.get(task_id, "unknown"),
                "running": not task.done()
            }
            for task_id, task in self.tasks.items()
        ]

    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a background task"""
        if task_id not in self.tasks:
            return False
        
        task = self.tasks[task_id]
        if not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
        
        self.task_status[task_id] = "cancelled"
        return True

# Create singleton instance
background_tasks = BackgroundTaskManager() 