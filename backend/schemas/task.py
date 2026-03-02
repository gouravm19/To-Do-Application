from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from models.task import TaskStatus, TaskPriority


class CreateTaskRequest(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    category_id: Optional[str] = None
    is_pinned: bool = False


class UpdateTaskRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    category_id: Optional[str] = None
    is_pinned: Optional[bool] = None


class UpdateStatusRequest(BaseModel):
    status: TaskStatus


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    user_id: str
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    category_color: Optional[str] = None
    is_pinned: bool
    is_overdue: bool = False
    created_at: datetime
    updated_at: datetime


class TaskStatsResponse(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    cancelled: int
    overdue: int
    due_today: int
    due_this_week: int
    completion_rate: float
    by_priority: Dict[str, int]
    by_category: List[Dict]


class PaginatedTasksResponse(BaseModel):
    items: List[TaskResponse]
    total: int
    page: int
    size: int
    pages: int
