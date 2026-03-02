from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re


class CreateCategoryRequest(BaseModel):
    name: str = Field(..., max_length=50)
    color: str = Field(default="#3b82f6", max_length=7)
    icon: Optional[str] = Field(None, max_length=50)

    @field_validator('color')
    @classmethod
    def validate_hex_color(cls, v):
        if not re.match(r'^#[0-9A-Fa-f]{6}$', v):
            raise ValueError('Color must be a valid hex color (e.g., #3b82f6)')
        return v


class UpdateCategoryRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=7)
    icon: Optional[str] = Field(None, max_length=50)

    @field_validator('color')
    @classmethod
    def validate_hex_color(cls, v):
        if v and not re.match(r'^#[0-9A-Fa-f]{6}$', v):
            raise ValueError('Color must be a valid hex color (e.g., #3b82f6)')
        return v


class CategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    icon: Optional[str] = None
    user_id: str
    is_default: bool
    task_count: int = 0
    completed_count: int = 0
    created_at: datetime
