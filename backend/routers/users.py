from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
import logging

from schemas.auth import UserResponse, UpdateProfileRequest, ChangePasswordRequest
from utils.jwt import verify_token
from utils.password import hash_password, verify_password
from utils.database import get_db, serialize_datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["Users"])
security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token"""
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


def user_to_response(user_doc: dict) -> UserResponse:
    """Convert user document to response model"""
    return UserResponse(
        id=user_doc['id'],
        username=user_doc['username'],
        email=user_doc['email'],
        first_name=user_doc.get('first_name'),
        last_name=user_doc.get('last_name'),
        avatar_url=user_doc.get('avatar_url'),
        is_verified=user_doc.get('is_verified', False),
        created_at=datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at'],
        last_login_at=datetime.fromisoformat(user_doc['last_login_at']) if user_doc.get('last_login_at') and isinstance(user_doc['last_login_at'], str) else user_doc.get('last_login_at')
    )


@router.get("/profile", response_model=UserResponse)
async def get_profile(user_id: str = Depends(get_current_user_id)):
    """Get current user's profile"""
    db = get_db()
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_to_response(user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(request: UpdateProfileRequest, user_id: str = Depends(get_current_user_id)):
    """Update current user's profile"""
    db = get_db()
    
    update_data = {}
    if request.first_name is not None:
        update_data['first_name'] = request.first_name
    if request.last_name is not None:
        update_data['last_name'] = request.last_name
    if request.avatar_url is not None:
        update_data['avatar_url'] = request.avatar_url
    
    if update_data:
        update_data['updated_at'] = serialize_datetime(datetime.now(timezone.utc))
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    return user_to_response(user)


@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(request: ChangePasswordRequest, user_id: str = Depends(get_current_user_id)):
    """Change user password"""
    db = get_db()
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(request.current_password, user['password_hash']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    new_hash = hash_password(request.new_password)
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"password_hash": new_hash, "updated_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    # Revoke all refresh tokens (logout everywhere)
    await db.refresh_tokens.update_many(
        {"user_id": user_id},
        {"$set": {"is_revoked": True}}
    )
    
    return {"message": "Password changed successfully. Please login again."}


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(user_id: str = Depends(get_current_user_id)):
    """Delete user account and all associated data"""
    db = get_db()
    
    # Delete all user data
    await db.tasks.delete_many({"user_id": user_id})
    await db.categories.delete_many({"user_id": user_id})
    await db.notifications.delete_many({"user_id": user_id})
    await db.refresh_tokens.delete_many({"user_id": user_id})
    await db.password_reset_tokens.delete_many({"user_id": user_id})
    await db.users.delete_one({"id": user_id})
    
    return None
