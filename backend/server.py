from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
import os
import logging
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Scheduler
scheduler = AsyncIOScheduler()


async def create_indexes():
    """Create database indexes for better query performance"""
    try:
        # Users indexes
        await db.users.create_index("id", unique=True)
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        
        # Tasks indexes
        await db.tasks.create_index("id", unique=True)
        await db.tasks.create_index("user_id")
        await db.tasks.create_index([("user_id", 1), ("status", 1)])
        await db.tasks.create_index([("user_id", 1), ("due_date", 1)])
        await db.tasks.create_index([("user_id", 1), ("category_id", 1)])
        
        # Categories indexes
        await db.categories.create_index("id", unique=True)
        await db.categories.create_index([("user_id", 1), ("name", 1)], unique=True)
        
        # Notifications indexes
        await db.notifications.create_index("id", unique=True)
        await db.notifications.create_index([("user_id", 1), ("is_read", 1)])
        
        # Refresh tokens indexes
        await db.refresh_tokens.create_index("id", unique=True)
        await db.refresh_tokens.create_index("token_hash", unique=True)
        await db.refresh_tokens.create_index("user_id")
        
        # Password reset tokens indexes
        await db.password_reset_tokens.create_index("id", unique=True)
        await db.password_reset_tokens.create_index("token_hash")
        await db.password_reset_tokens.create_index("user_id")
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")


async def seed_demo_user():
    """Seed demo user and sample data"""
    from utils.password import hash_password
    from utils.database import serialize_datetime
    import uuid
    
    # Check if demo user exists
    existing = await db.users.find_one({"email": "demo@todo.com"}, {"_id": 0})
    if existing:
        logger.info("Demo user already exists")
        return
    
    user_id = str(uuid.uuid4())
    
    # Create demo user
    demo_user = {
        "id": user_id,
        "username": "demo",
        "email": "demo@todo.com",
        "password_hash": hash_password("Demo@1234"),
        "first_name": "Demo",
        "last_name": "User",
        "is_enabled": True,
        "is_verified": True,
        "created_at": serialize_datetime(datetime.now(timezone.utc)),
        "updated_at": serialize_datetime(datetime.now(timezone.utc))
    }
    await db.users.insert_one(demo_user)
    logger.info("Demo user created: demo@todo.com / Demo@1234")
    
    # Create default categories
    categories = [
        {"id": str(uuid.uuid4()), "name": "Work", "color": "#3b82f6", "icon": "briefcase", "is_default": True},
        {"id": str(uuid.uuid4()), "name": "Personal", "color": "#8b5cf6", "icon": "user", "is_default": True},
        {"id": str(uuid.uuid4()), "name": "Shopping", "color": "#10b981", "icon": "shopping-cart", "is_default": True},
        {"id": str(uuid.uuid4()), "name": "Health", "color": "#ef4444", "icon": "heart", "is_default": True},
    ]
    
    for cat in categories:
        cat["user_id"] = user_id
        cat["created_at"] = serialize_datetime(datetime.now(timezone.utc))
        await db.categories.insert_one(cat)
    
    # Create sample tasks
    now = datetime.now(timezone.utc)
    sample_tasks = [
        {"title": "Complete project proposal", "description": "Write and submit the Q1 project proposal", "status": "COMPLETED", "priority": "HIGH", "category_id": categories[0]["id"], "due_date": now - timedelta(days=2), "completed_at": now - timedelta(days=1)},
        {"title": "Review team updates", "description": "Check Slack and review team progress", "status": "COMPLETED", "priority": "MEDIUM", "category_id": categories[0]["id"], "due_date": now - timedelta(days=1), "completed_at": now - timedelta(hours=5)},
        {"title": "Prepare presentation slides", "description": "Create slides for Monday's meeting", "status": "IN_PROGRESS", "priority": "URGENT", "category_id": categories[0]["id"], "due_date": now + timedelta(days=1), "is_pinned": True},
        {"title": "Buy groceries", "description": "Milk, eggs, bread, vegetables", "status": "PENDING", "priority": "MEDIUM", "category_id": categories[2]["id"], "due_date": now + timedelta(hours=6)},
        {"title": "Call mom", "description": "Weekly catch-up call", "status": "PENDING", "priority": "LOW", "category_id": categories[1]["id"], "due_date": now + timedelta(days=2)},
        {"title": "Gym workout", "description": "Leg day - squats, lunges, deadlifts", "status": "PENDING", "priority": "MEDIUM", "category_id": categories[3]["id"], "due_date": now + timedelta(hours=3)},
        {"title": "Fix login bug", "description": "Users reporting login issues on Safari", "status": "PENDING", "priority": "URGENT", "category_id": categories[0]["id"], "due_date": now - timedelta(hours=6)},  # Overdue
        {"title": "Update resume", "description": "Add recent projects and skills", "status": "PENDING", "priority": "LOW", "category_id": categories[1]["id"], "due_date": now - timedelta(days=3)},  # Overdue
        {"title": "Read book chapter", "description": "Chapter 5 of 'Clean Code'", "status": "COMPLETED", "priority": "LOW", "category_id": categories[1]["id"], "due_date": now - timedelta(days=4), "completed_at": now - timedelta(days=3)},
        {"title": "Schedule dentist appointment", "description": "Annual checkup overdue", "status": "PENDING", "priority": "MEDIUM", "category_id": categories[3]["id"], "due_date": now + timedelta(days=5), "is_pinned": True},
    ]
    
    for task_data in sample_tasks:
        task = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": task_data["title"],
            "description": task_data.get("description"),
            "status": task_data.get("status", "PENDING"),
            "priority": task_data.get("priority", "MEDIUM"),
            "category_id": task_data.get("category_id"),
            "is_pinned": task_data.get("is_pinned", False),
            "reminder_sent": False,
            "due_date": serialize_datetime(task_data.get("due_date")) if task_data.get("due_date") else None,
            "completed_at": serialize_datetime(task_data.get("completed_at")) if task_data.get("completed_at") else None,
            "created_at": serialize_datetime(now - timedelta(days=7)),
            "updated_at": serialize_datetime(now)
        }
        await db.tasks.insert_one(task)
    
    logger.info("Created 10 sample tasks for demo user")
    
    # Create sample notifications
    notifications = [
        {"type": "WELCOME", "title": "Welcome to TaskFlow!", "message": "Thank you for joining TaskFlow. Start by creating your first task!"},
        {"type": "TASK_REMINDER", "title": "Reminder: Prepare presentation slides", "message": "Your task 'Prepare presentation slides' is due tomorrow.", "task_id": None},
        {"type": "TASK_COMPLETED", "title": "Task Completed!", "message": "You completed 'Complete project proposal'. Great job!"},
        {"type": "TASK_DUE", "title": "Task Overdue", "message": "Your task 'Fix login bug' is overdue. Please review it."},
        {"type": "TASK_COMPLETED", "title": "Task Completed!", "message": "You completed 'Read book chapter'. Keep up the good work!"},
    ]
    
    for i, notif_data in enumerate(notifications):
        notif = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "task_id": notif_data.get("task_id"),
            "type": notif_data["type"],
            "title": notif_data["title"],
            "message": notif_data["message"],
            "is_read": i >= 3,  # First 3 unread
            "sent_at": serialize_datetime(now - timedelta(hours=i * 6)),
            "read_at": serialize_datetime(now - timedelta(hours=2)) if i >= 3 else None
        }
        await db.notifications.insert_one(notif)
    
    logger.info("Created 5 sample notifications for demo user")


async def send_task_reminders():
    """Send reminders for tasks due within 24 hours"""
    from services.email_service import send_task_reminder_email
    from utils.database import serialize_datetime
    
    logger.info("Running task reminder scheduler...")
    
    now = datetime.now(timezone.utc)
    tomorrow = now + timedelta(hours=24)
    
    # Find tasks due within 24 hours that haven't been reminded
    tasks = await db.tasks.find({
        "due_date": {
            "$gte": serialize_datetime(now),
            "$lte": serialize_datetime(tomorrow)
        },
        "status": {"$in": ["PENDING", "IN_PROGRESS"]},
        "reminder_sent": False
    }, {"_id": 0}).to_list(100)
    
    for task in tasks:
        # Get user email
        user = await db.users.find_one({"id": task['user_id']}, {"_id": 0})
        if user:
            due_date = task['due_date']
            if isinstance(due_date, str):
                due_date = datetime.fromisoformat(due_date)
            
            # Send reminder email
            await send_task_reminder_email(
                user['email'],
                task['title'],
                due_date.strftime("%B %d, %Y at %I:%M %p")
            )
            
            # Create notification
            notification = {
                "id": str(uuid.uuid4()),
                "user_id": task['user_id'],
                "task_id": task['id'],
                "type": "TASK_REMINDER",
                "title": f"Reminder: {task['title']}",
                "message": f"Your task '{task['title']}' is due soon.",
                "is_read": False,
                "sent_at": serialize_datetime(now)
            }
            await db.notifications.insert_one(notification)
            
            # Mark as reminded
            await db.tasks.update_one(
                {"id": task['id']},
                {"$set": {"reminder_sent": True}}
            )
            
            logger.info(f"Sent reminder for task: {task['title']} to {user['email']}")
    
    logger.info(f"Task reminder scheduler completed. Processed {len(tasks)} tasks.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting TaskFlow API...")
    await create_indexes()
    await seed_demo_user()
    
    # Start scheduler
    scheduler.add_job(send_task_reminders, 'interval', hours=1, id='task_reminders')
    scheduler.start()
    logger.info("Task reminder scheduler started")
    
    yield
    
    # Shutdown
    scheduler.shutdown()
    client.close()
    logger.info("TaskFlow API shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="TaskFlow API",
    description="A production-ready To-Do List API built with FastAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": get_error_type(exc.status_code),
            "message": exc.detail,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


def get_error_type(status_code: int) -> str:
    """Get error type string from status code"""
    error_types = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        422: "VALIDATION_ERROR",
        429: "RATE_LIMIT_EXCEEDED",
        500: "INTERNAL_ERROR"
    }
    return error_types.get(status_code, "UNKNOWN_ERROR")


# Import and include routers
from routers import auth_router, tasks_router, categories_router, notifications_router, users_router

app.include_router(auth_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(users_router, prefix="/api")


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    }


@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "message": "Welcome to TaskFlow API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
