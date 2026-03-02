from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
import uuid


class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    color: str = "#3b82f6"
    icon: Optional[str] = None
    user_id: str
    is_default: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
