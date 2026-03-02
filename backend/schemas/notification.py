from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.notification import NotificationType


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    task_id: Optional[str] = None
    type: NotificationType
    title: str
    message: str
    is_read: bool
    sent_at: datetime
    read_at: Optional[datetime] = None


class NotificationCountResponse(BaseModel):
    unread_count: int


class MarkReadResponse(BaseModel):
    marked_count: int


class PaginatedNotificationsResponse(BaseModel):
    items: List[NotificationResponse]
    total: int
    page: int
    size: int
