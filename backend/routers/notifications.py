from fastapi import APIRouter, HTTPException, Depends, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
from typing import Optional, List
import logging
import math

from schemas.notification import (
    NotificationResponse, NotificationCountResponse,
    MarkReadResponse, PaginatedNotificationsResponse
)
from utils.jwt import verify_token
from utils.database import get_db, serialize_datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/notifications", tags=["Notifications"])
security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token"""
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


def notification_to_response(doc: dict) -> NotificationResponse:
    """Convert notification document to response model"""
    return NotificationResponse(
        id=doc['id'],
        user_id=doc['user_id'],
        task_id=doc.get('task_id'),
        type=doc['type'],
        title=doc['title'],
        message=doc['message'],
        is_read=doc.get('is_read', False),
        sent_at=datetime.fromisoformat(doc['sent_at']) if isinstance(doc['sent_at'], str) else doc['sent_at'],
        read_at=datetime.fromisoformat(doc['read_at']) if doc.get('read_at') and isinstance(doc['read_at'], str) else doc.get('read_at')
    )


@router.get("", response_model=PaginatedNotificationsResponse)
async def get_notifications(
    is_read: Optional[bool] = None,
    page: int = Query(0, ge=0),
    size: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id)
):
    """Get paginated list of notifications"""
    db = get_db()
    
    query = {"user_id": user_id}
    if is_read is not None:
        query["is_read"] = is_read
    
    total = await db.notifications.count_documents(query)
    notifications = await db.notifications.find(query, {"_id": 0}).sort("sent_at", -1).skip(page * size).limit(size).to_list(size)
    
    return PaginatedNotificationsResponse(
        items=[notification_to_response(n) for n in notifications],
        total=total,
        page=page,
        size=size
    )


@router.get("/count", response_model=NotificationCountResponse)
async def get_unread_count(user_id: str = Depends(get_current_user_id)):
    """Get count of unread notifications"""
    db = get_db()
    
    count = await db.notifications.count_documents({"user_id": user_id, "is_read": False})
    
    return NotificationCountResponse(unread_count=count)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(notification_id: str, user_id: str = Depends(get_current_user_id)):
    """Mark a notification as read"""
    db = get_db()
    
    notification = await db.notifications.find_one({"id": notification_id, "user_id": user_id}, {"_id": 0})
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    await db.notifications.update_one(
        {"id": notification_id},
        {"$set": {"is_read": True, "read_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    updated = await db.notifications.find_one({"id": notification_id}, {"_id": 0})
    return notification_to_response(updated)


@router.post("/read-all", response_model=MarkReadResponse)
async def mark_all_read(user_id: str = Depends(get_current_user_id)):
    """Mark all notifications as read"""
    db = get_db()
    
    result = await db.notifications.update_many(
        {"user_id": user_id, "is_read": False},
        {"$set": {"is_read": True, "read_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    return MarkReadResponse(marked_count=result.modified_count)


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(notification_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a notification"""
    db = get_db()
    
    result = await db.notifications.delete_one({"id": notification_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return None
