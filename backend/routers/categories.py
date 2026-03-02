from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
from typing import List
import logging

from schemas.category import CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse
from models.category import Category
from utils.jwt import verify_token
from utils.database import get_db, serialize_datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/categories", tags=["Categories"])
security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token"""
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


@router.get("", response_model=List[CategoryResponse])
async def get_categories(user_id: str = Depends(get_current_user_id)):
    """Get all categories for the current user with task counts"""
    db = get_db()
    
    categories = await db.categories.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    
    # Get task counts for each category
    result = []
    for cat in categories:
        task_count = await db.tasks.count_documents({"category_id": cat['id'], "user_id": user_id})
        completed_count = await db.tasks.count_documents({"category_id": cat['id'], "user_id": user_id, "status": "COMPLETED"})
        
        result.append(CategoryResponse(
            id=cat['id'],
            name=cat['name'],
            color=cat['color'],
            icon=cat.get('icon'),
            user_id=cat['user_id'],
            is_default=cat.get('is_default', False),
            task_count=task_count,
            completed_count=completed_count,
            created_at=datetime.fromisoformat(cat['created_at']) if isinstance(cat['created_at'], str) else cat['created_at']
        ))
    
    return result


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(request: CreateCategoryRequest, user_id: str = Depends(get_current_user_id)):
    """Create a new category"""
    db = get_db()
    
    # Check if name already exists for user
    existing = await db.categories.find_one({"name": request.name, "user_id": user_id}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    category = Category(
        user_id=user_id,
        name=request.name,
        color=request.color,
        icon=request.icon
    )
    
    cat_doc = category.model_dump()
    cat_doc['created_at'] = serialize_datetime(cat_doc['created_at'])
    
    await db.categories.insert_one(cat_doc)
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        color=category.color,
        icon=category.icon,
        user_id=category.user_id,
        is_default=category.is_default,
        task_count=0,
        completed_count=0,
        created_at=category.created_at
    )


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, request: UpdateCategoryRequest, user_id: str = Depends(get_current_user_id)):
    """Update an existing category"""
    db = get_db()
    
    category = await db.categories.find_one({"id": category_id, "user_id": user_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {}
    if request.name is not None:
        # Check for duplicate name
        existing = await db.categories.find_one(
            {"name": request.name, "user_id": user_id, "id": {"$ne": category_id}},
            {"_id": 0}
        )
        if existing:
            raise HTTPException(status_code=400, detail="Category with this name already exists")
        update_data['name'] = request.name
    if request.color is not None:
        update_data['color'] = request.color
    if request.icon is not None:
        update_data['icon'] = request.icon
    
    if update_data:
        await db.categories.update_one({"id": category_id}, {"$set": update_data})
    
    # Get updated category
    updated = await db.categories.find_one({"id": category_id}, {"_id": 0})
    task_count = await db.tasks.count_documents({"category_id": category_id, "user_id": user_id})
    completed_count = await db.tasks.count_documents({"category_id": category_id, "user_id": user_id, "status": "COMPLETED"})
    
    return CategoryResponse(
        id=updated['id'],
        name=updated['name'],
        color=updated['color'],
        icon=updated.get('icon'),
        user_id=updated['user_id'],
        is_default=updated.get('is_default', False),
        task_count=task_count,
        completed_count=completed_count,
        created_at=datetime.fromisoformat(updated['created_at']) if isinstance(updated['created_at'], str) else updated['created_at']
    )


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a category"""
    db = get_db()
    
    category = await db.categories.find_one({"id": category_id, "user_id": user_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if tasks exist in category
    task_count = await db.tasks.count_documents({"category_id": category_id})
    if task_count > 0:
        raise HTTPException(status_code=400, detail=f"Cannot delete category with {task_count} tasks. Move or delete tasks first.")
    
    await db.categories.delete_one({"id": category_id})
    
    return None
