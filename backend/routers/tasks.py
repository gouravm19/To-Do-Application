from fastapi import APIRouter, HTTPException, Depends, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone, timedelta
from typing import Optional, List
import logging
import math

from schemas.task import (
    CreateTaskRequest, UpdateTaskRequest, TaskResponse,
    UpdateStatusRequest, TaskStatsResponse, PaginatedTasksResponse
)
from models.task import Task, TaskStatus, TaskPriority
from models.notification import Notification, NotificationType
from utils.jwt import verify_token
from utils.database import get_db, serialize_datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tasks", tags=["Tasks"])
security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token"""
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


def task_to_response(task_doc: dict, category_doc: dict = None) -> TaskResponse:
    """Convert task document to response model"""
    # Check if overdue
    is_overdue = False
    if task_doc.get('due_date') and task_doc.get('status') not in ['COMPLETED', 'CANCELLED']:
        due_date = task_doc['due_date']
        if isinstance(due_date, str):
            due_date = datetime.fromisoformat(due_date)
        is_overdue = due_date < datetime.now(timezone.utc)
    
    return TaskResponse(
        id=task_doc['id'],
        title=task_doc['title'],
        description=task_doc.get('description'),
        status=task_doc['status'],
        priority=task_doc['priority'],
        due_date=datetime.fromisoformat(task_doc['due_date']) if task_doc.get('due_date') and isinstance(task_doc['due_date'], str) else task_doc.get('due_date'),
        completed_at=datetime.fromisoformat(task_doc['completed_at']) if task_doc.get('completed_at') and isinstance(task_doc['completed_at'], str) else task_doc.get('completed_at'),
        user_id=task_doc['user_id'],
        category_id=task_doc.get('category_id'),
        category_name=category_doc['name'] if category_doc else None,
        category_color=category_doc['color'] if category_doc else None,
        is_pinned=task_doc.get('is_pinned', False),
        is_overdue=is_overdue,
        created_at=datetime.fromisoformat(task_doc['created_at']) if isinstance(task_doc['created_at'], str) else task_doc['created_at'],
        updated_at=datetime.fromisoformat(task_doc['updated_at']) if isinstance(task_doc['updated_at'], str) else task_doc['updated_at']
    )


@router.get("", response_model=PaginatedTasksResponse)
async def get_tasks(
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    category_id: Optional[str] = None,
    search: Optional[str] = None,
    due_date: Optional[str] = Query(None, description="today, week, or overdue"),
    pinned: Optional[bool] = None,
    sort: Optional[str] = Query("createdAt", description="createdAt, dueDate, priority, title"),
    order: Optional[str] = Query("desc", description="asc or desc"),
    page: int = Query(0, ge=0),
    size: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id)
):
    """Get paginated list of tasks with filters"""
    db = get_db()
    
    # Build query
    query = {"user_id": user_id}
    
    if status:
        query["status"] = status.value
    if priority:
        query["priority"] = priority.value
    if category_id:
        query["category_id"] = category_id
    if pinned is not None:
        query["is_pinned"] = pinned
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Due date filters
    now = datetime.now(timezone.utc)
    if due_date == "today":
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        query["due_date"] = {
            "$gte": serialize_datetime(start_of_day),
            "$lt": serialize_datetime(end_of_day)
        }
    elif due_date == "week":
        end_of_week = now + timedelta(days=7)
        query["due_date"] = {
            "$gte": serialize_datetime(now),
            "$lte": serialize_datetime(end_of_week)
        }
    elif due_date == "overdue":
        query["due_date"] = {"$lt": serialize_datetime(now)}
        query["status"] = {"$nin": ["COMPLETED", "CANCELLED"]}
    
    # Sorting
    sort_field_map = {
        "createdAt": "created_at",
        "dueDate": "due_date",
        "priority": "priority",
        "title": "title"
    }
    sort_field = sort_field_map.get(sort, "created_at")
    sort_direction = 1 if order == "asc" else -1
    
    # Get total count
    total = await db.tasks.count_documents(query)
    
    # Get paginated tasks
    tasks = await db.tasks.find(query, {"_id": 0}).sort(sort_field, sort_direction).skip(page * size).limit(size).to_list(size)
    
    # Get categories for tasks
    category_ids = list(set(t.get('category_id') for t in tasks if t.get('category_id')))
    categories = {}
    if category_ids:
        cat_docs = await db.categories.find({"id": {"$in": category_ids}}, {"_id": 0}).to_list(len(category_ids))
        categories = {c['id']: c for c in cat_docs}
    
    # Build response
    task_responses = [
        task_to_response(task, categories.get(task.get('category_id')))
        for task in tasks
    ]
    
    return PaginatedTasksResponse(
        items=task_responses,
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total > 0 else 0
    )


@router.get("/stats", response_model=TaskStatsResponse)
async def get_task_stats(user_id: str = Depends(get_current_user_id)):
    """Get task statistics for the current user"""
    db = get_db()
    
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)
    end_of_week = now + timedelta(days=7)
    
    # Get all user tasks
    tasks = await db.tasks.find({"user_id": user_id}, {"_id": 0}).to_list(10000)
    
    total = len(tasks)
    pending = sum(1 for t in tasks if t['status'] == 'PENDING')
    in_progress = sum(1 for t in tasks if t['status'] == 'IN_PROGRESS')
    completed = sum(1 for t in tasks if t['status'] == 'COMPLETED')
    cancelled = sum(1 for t in tasks if t['status'] == 'CANCELLED')
    
    # Overdue tasks
    overdue = 0
    for t in tasks:
        if t.get('due_date') and t['status'] not in ['COMPLETED', 'CANCELLED']:
            due = datetime.fromisoformat(t['due_date']) if isinstance(t['due_date'], str) else t['due_date']
            if due < now:
                overdue += 1
    
    # Due today
    due_today = 0
    for t in tasks:
        if t.get('due_date') and t['status'] not in ['COMPLETED', 'CANCELLED']:
            due = datetime.fromisoformat(t['due_date']) if isinstance(t['due_date'], str) else t['due_date']
            if start_of_day <= due < end_of_day:
                due_today += 1
    
    # Due this week
    due_this_week = 0
    for t in tasks:
        if t.get('due_date') and t['status'] not in ['COMPLETED', 'CANCELLED']:
            due = datetime.fromisoformat(t['due_date']) if isinstance(t['due_date'], str) else t['due_date']
            if now <= due <= end_of_week:
                due_this_week += 1
    
    # Completion rate
    completion_rate = (completed / total * 100) if total > 0 else 0
    
    # By priority
    by_priority = {
        "LOW": sum(1 for t in tasks if t['priority'] == 'LOW'),
        "MEDIUM": sum(1 for t in tasks if t['priority'] == 'MEDIUM'),
        "HIGH": sum(1 for t in tasks if t['priority'] == 'HIGH'),
        "URGENT": sum(1 for t in tasks if t['priority'] == 'URGENT')
    }
    
    # By category
    categories = await db.categories.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    by_category = []
    for cat in categories:
        cat_tasks = [t for t in tasks if t.get('category_id') == cat['id']]
        by_category.append({
            "category_name": cat['name'],
            "count": len(cat_tasks),
            "color": cat['color']
        })
    
    return TaskStatsResponse(
        total=total,
        pending=pending,
        in_progress=in_progress,
        completed=completed,
        cancelled=cancelled,
        overdue=overdue,
        due_today=due_today,
        due_this_week=due_this_week,
        completion_rate=round(completion_rate, 1),
        by_priority=by_priority,
        by_category=by_category
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, user_id: str = Depends(get_current_user_id)):
    """Get a single task by ID"""
    db = get_db()
    
    task = await db.tasks.find_one({"id": task_id, "user_id": user_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    category = None
    if task.get('category_id'):
        category = await db.categories.find_one({"id": task['category_id']}, {"_id": 0})
    
    return task_to_response(task, category)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(request: CreateTaskRequest, user_id: str = Depends(get_current_user_id)):
    """Create a new task"""
    db = get_db()
    
    # Validate category if provided
    category = None
    if request.category_id:
        category = await db.categories.find_one({"id": request.category_id, "user_id": user_id}, {"_id": 0})
        if not category:
            raise HTTPException(status_code=400, detail="Category not found")
    
    task = Task(
        user_id=user_id,
        title=request.title,
        description=request.description,
        priority=request.priority,
        due_date=request.due_date,
        category_id=request.category_id,
        is_pinned=request.is_pinned
    )
    
    task_doc = task.model_dump()
    task_doc['created_at'] = serialize_datetime(task_doc['created_at'])
    task_doc['updated_at'] = serialize_datetime(task_doc['updated_at'])
    if task_doc.get('due_date'):
        task_doc['due_date'] = serialize_datetime(task_doc['due_date'])
    
    await db.tasks.insert_one(task_doc)
    
    return task_to_response(task_doc, category)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, request: UpdateTaskRequest, user_id: str = Depends(get_current_user_id)):
    """Update an existing task"""
    db = get_db()
    
    # Check ownership
    task = await db.tasks.find_one({"id": task_id, "user_id": user_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Build update dict
    update_data = {}
    if request.title is not None:
        update_data['title'] = request.title
    if request.description is not None:
        update_data['description'] = request.description
    if request.status is not None:
        update_data['status'] = request.status.value
        if request.status == TaskStatus.COMPLETED:
            update_data['completed_at'] = serialize_datetime(datetime.now(timezone.utc))
        elif task['status'] == 'COMPLETED' and request.status != TaskStatus.COMPLETED:
            update_data['completed_at'] = None
    if request.priority is not None:
        update_data['priority'] = request.priority.value
    if request.due_date is not None:
        update_data['due_date'] = serialize_datetime(request.due_date)
    if request.category_id is not None:
        # Validate category
        if request.category_id:
            category = await db.categories.find_one({"id": request.category_id, "user_id": user_id}, {"_id": 0})
            if not category:
                raise HTTPException(status_code=400, detail="Category not found")
        update_data['category_id'] = request.category_id
    if request.is_pinned is not None:
        update_data['is_pinned'] = request.is_pinned
    
    update_data['updated_at'] = serialize_datetime(datetime.now(timezone.utc))
    
    await db.tasks.update_one({"id": task_id}, {"$set": update_data})
    
    # Get updated task
    updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    category = None
    if updated_task.get('category_id'):
        category = await db.categories.find_one({"id": updated_task['category_id']}, {"_id": 0})
    
    return task_to_response(updated_task, category)


@router.patch("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(task_id: str, request: UpdateStatusRequest, user_id: str = Depends(get_current_user_id)):
    """Update task status"""
    db = get_db()
    
    task = await db.tasks.find_one({"id": task_id, "user_id": user_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = {
        "status": request.status.value,
        "updated_at": serialize_datetime(datetime.now(timezone.utc))
    }
    
    if request.status == TaskStatus.COMPLETED:
        update_data['completed_at'] = serialize_datetime(datetime.now(timezone.utc))
        # Create completion notification
        notification = Notification(
            user_id=user_id,
            task_id=task_id,
            type=NotificationType.TASK_COMPLETED,
            title="Task Completed!",
            message=f"You completed '{task['title']}'. Great job!"
        )
        notif_doc = notification.model_dump()
        notif_doc['sent_at'] = serialize_datetime(notif_doc['sent_at'])
        await db.notifications.insert_one(notif_doc)
    elif task['status'] == 'COMPLETED':
        update_data['completed_at'] = None
    
    await db.tasks.update_one({"id": task_id}, {"$set": update_data})
    
    updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    category = None
    if updated_task.get('category_id'):
        category = await db.categories.find_one({"id": updated_task['category_id']}, {"_id": 0})
    
    return task_to_response(updated_task, category)


@router.patch("/{task_id}/pin", response_model=TaskResponse)
async def toggle_task_pin(task_id: str, user_id: str = Depends(get_current_user_id)):
    """Toggle task pin status"""
    db = get_db()
    
    task = await db.tasks.find_one({"id": task_id, "user_id": user_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_pinned = not task.get('is_pinned', False)
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": {"is_pinned": new_pinned, "updated_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    category = None
    if updated_task.get('category_id'):
        category = await db.categories.find_one({"id": updated_task['category_id']}, {"_id": 0})
    
    return task_to_response(updated_task, category)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a task"""
    db = get_db()
    
    result = await db.tasks.delete_one({"id": task_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return None
