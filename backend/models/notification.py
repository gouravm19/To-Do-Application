from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from enum import Enum
import uuid


class NotificationType(str, Enum):
    TASK_REMINDER = "TASK_REMINDER"
    TASK_DUE = "TASK_DUE"
    WELCOME = "WELCOME"
    PASSWORD_RESET = "PASSWORD_RESET"
    TASK_COMPLETED = "TASK_COMPLETED"


class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    task_id: Optional[str] = None
    type: NotificationType
    title: str
    message: str
    is_read: bool = False
    sent_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read_at: Optional[datetime] = None
