from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
from typing import Optional
import hashlib
import random
import logging

from schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse, RefreshTokenRequest,
    ForgotPasswordRequest, ResetPasswordRequest, UserResponse
)
from models.user import User, RefreshToken, PasswordResetToken
from models.category import Category
from models.notification import Notification, NotificationType
from utils.jwt import create_access_token, create_refresh_token, verify_token
from utils.password import hash_password, verify_password
from utils.database import get_db, serialize_datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


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


async def create_default_categories(user_id: str):
    """Create default categories for a new user"""
    db = get_db()
    default_categories = [
        {"name": "Work", "color": "#3b82f6", "icon": "briefcase", "is_default": True},
        {"name": "Personal", "color": "#8b5cf6", "icon": "user", "is_default": True},
        {"name": "Shopping", "color": "#10b981", "icon": "shopping-cart", "is_default": True},
        {"name": "Health", "color": "#ef4444", "icon": "heart", "is_default": True},
    ]
    
    for cat_data in default_categories:
        category = Category(user_id=user_id, **cat_data)
        doc = category.model_dump()
        doc['created_at'] = serialize_datetime(doc['created_at'])
        await db.categories.insert_one(doc)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    """Register a new user"""
    db = get_db()
    
    # Check if email or username already exists
    existing_user = await db.users.find_one(
        {"$or": [{"email": request.email}, {"username": request.username}]},
        {"_id": 0}
    )
    if existing_user:
        if existing_user.get('email') == request.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    user = User(
        username=request.username,
        email=request.email,
        password_hash=hash_password(request.password),
        first_name=request.first_name,
        last_name=request.last_name
    )
    
    user_doc = user.model_dump()
    user_doc['created_at'] = serialize_datetime(user_doc['created_at'])
    user_doc['updated_at'] = serialize_datetime(user_doc['updated_at'])
    
    await db.users.insert_one(user_doc)
    
    # Create default categories
    await create_default_categories(user.id)
    
    # Create welcome notification
    notification = Notification(
        user_id=user.id,
        type=NotificationType.WELCOME,
        title="Welcome to TaskFlow!",
        message="Thank you for joining TaskFlow. Start by creating your first task!"
    )
    notif_doc = notification.model_dump()
    notif_doc['sent_at'] = serialize_datetime(notif_doc['sent_at'])
    await db.notifications.insert_one(notif_doc)
    
    # Create tokens
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    # Store refresh token
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    refresh_doc = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    ).model_dump()
    refresh_doc['expires_at'] = serialize_datetime(refresh_doc['expires_at'])
    refresh_doc['created_at'] = serialize_datetime(refresh_doc['created_at'])
    await db.refresh_tokens.insert_one(refresh_doc)
    
    # Send welcome email (async, don't block registration)
    from services.email_service import send_welcome_email
    try:
        await send_welcome_email(user.email, user.username)
    except Exception as e:
        logger.warning(f"Failed to send welcome email: {e}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_response(user_doc)
    )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login with username/email and password"""
    db = get_db()
    
    # Find user by email or username
    query = {}
    if request.email:
        query["email"] = request.email
    elif request.username:
        query["username"] = request.username
    else:
        raise HTTPException(status_code=400, detail="Email or username required")
    
    user_doc = await db.users.find_one(query, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(request.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if user is enabled
    if not user_doc.get('is_enabled', True):
        raise HTTPException(status_code=401, detail="Account is disabled")
    
    # Update last login
    await db.users.update_one(
        {"id": user_doc['id']},
        {"$set": {"last_login_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    # Create tokens
    access_token = create_access_token(user_doc['id'])
    refresh_token = create_refresh_token(user_doc['id'])
    
    # Store refresh token
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    refresh_doc = RefreshToken(
        user_id=user_doc['id'],
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    ).model_dump()
    refresh_doc['expires_at'] = serialize_datetime(refresh_doc['expires_at'])
    refresh_doc['created_at'] = serialize_datetime(refresh_doc['created_at'])
    await db.refresh_tokens.insert_one(refresh_doc)
    
    user_doc['last_login_at'] = serialize_datetime(datetime.now(timezone.utc))
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_response(user_doc)
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token"""
    db = get_db()
    
    # Verify refresh token
    payload = verify_token(request.refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    token_hash = hashlib.sha256(request.refresh_token.encode()).hexdigest()
    
    # Check if token exists and is not revoked
    token_doc = await db.refresh_tokens.find_one(
        {"token_hash": token_hash, "user_id": user_id, "is_revoked": False},
        {"_id": 0}
    )
    if not token_doc:
        raise HTTPException(status_code=401, detail="Invalid or revoked refresh token")
    
    # Revoke old refresh token
    await db.refresh_tokens.update_one(
        {"token_hash": token_hash},
        {"$set": {"is_revoked": True}}
    )
    
    # Get user
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Create new tokens
    new_access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)
    
    # Store new refresh token
    new_token_hash = hashlib.sha256(new_refresh_token.encode()).hexdigest()
    new_refresh_doc = RefreshToken(
        user_id=user_id,
        token_hash=new_token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    ).model_dump()
    new_refresh_doc['expires_at'] = serialize_datetime(new_refresh_doc['expires_at'])
    new_refresh_doc['created_at'] = serialize_datetime(new_refresh_doc['created_at'])
    await db.refresh_tokens.insert_one(new_refresh_doc)
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        user=user_to_response(user_doc)
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: RefreshTokenRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Logout and revoke refresh token"""
    db = get_db()
    
    token_hash = hashlib.sha256(request.refresh_token.encode()).hexdigest()
    await db.refresh_tokens.update_one(
        {"token_hash": token_hash},
        {"$set": {"is_revoked": True}}
    )
    
    return None


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(request: ForgotPasswordRequest):
    """Send password reset OTP to email"""
    db = get_db()
    
    # Always return 200 to not reveal if email exists
    user_doc = await db.users.find_one({"email": request.email}, {"_id": 0})
    
    if user_doc:
        # Generate 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Store OTP with expiry
        otp_doc = PasswordResetToken(
            user_id=user_doc['id'],
            token_hash=hashlib.sha256(otp.encode()).hexdigest(),
            otp=otp,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
        ).model_dump()
        otp_doc['expires_at'] = serialize_datetime(otp_doc['expires_at'])
        otp_doc['created_at'] = serialize_datetime(otp_doc['created_at'])
        
        await db.password_reset_tokens.insert_one(otp_doc)
        
        # Send OTP email
        from services.email_service import send_otp_email
        try:
            await send_otp_email(request.email, otp)
        except Exception as e:
            logger.warning(f"Failed to send OTP email: {e}")
    
    return {"message": "If the email exists, an OTP has been sent"}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(request: ResetPasswordRequest):
    """Reset password using OTP"""
    db = get_db()
    
    # Find user
    user_doc = await db.users.find_one({"email": request.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=400, detail="Invalid email or OTP")
    
    # Find valid OTP
    otp_hash = hashlib.sha256(request.otp.encode()).hexdigest()
    otp_doc = await db.password_reset_tokens.find_one({
        "user_id": user_doc['id'],
        "token_hash": otp_hash,
        "used_at": None
    }, {"_id": 0})
    
    if not otp_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check expiry
    expires_at = datetime.fromisoformat(otp_doc['expires_at']) if isinstance(otp_doc['expires_at'], str) else otp_doc['expires_at']
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")
    
    # Update password
    new_password_hash = hash_password(request.new_password)
    await db.users.update_one(
        {"id": user_doc['id']},
        {"$set": {"password_hash": new_password_hash, "updated_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    # Mark OTP as used
    await db.password_reset_tokens.update_one(
        {"id": otp_doc['id']},
        {"$set": {"used_at": serialize_datetime(datetime.now(timezone.utc))}}
    )
    
    # Revoke all refresh tokens
    await db.refresh_tokens.update_many(
        {"user_id": user_doc['id']},
        {"$set": {"is_revoked": True}}
    )
    
    return {"message": "Password reset successfully"}
