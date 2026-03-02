from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'taskflow_db')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]


def get_db():
    """Get database instance"""
    return db


def serialize_datetime(dt: datetime) -> str:
    """Serialize datetime to ISO format string"""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def deserialize_datetime(dt_str: str) -> datetime:
    """Deserialize ISO format string to datetime"""
    if dt_str is None:
        return None
    return datetime.fromisoformat(dt_str)
