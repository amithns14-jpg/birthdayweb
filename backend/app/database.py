import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ensure backend directory is in sys.path
current_file_dir = os.path.dirname(os.path.abspath(__file__)) # backend/app
backend_dir = os.path.dirname(current_file_dir) # backend
root_dir = os.path.dirname(backend_dir) # project root
for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

BASE_DIR = backend_dir

# On Vercel, /var/task is read-only. Use /tmp for SQLite if DATABASE_URL is not provided
if os.getenv("VERCEL") and not os.getenv("DATABASE_URL"):
    DATABASE_URL = "sqlite:////tmp/birthday.db"
else:
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'birthday.db')}")

# SQLite specific config
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
