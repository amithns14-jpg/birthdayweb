import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ensure proper path resolution
current_dir = os.path.dirname(os.path.abspath(__file__)) # .../backend/app
backend_dir = os.path.dirname(current_dir) # .../backend
root_dir = os.path.dirname(backend_dir) # .../
for d in [backend_dir, root_dir]:
    if d not in sys.path:
        sys.path.insert(0, d)

try:
    from app.database import engine, Base, SessionLocal, BASE_DIR
    from app.services.seed_data import init_seed_data
    from app.routers import (
        auth,
        profile,
        photos,
        memories,
        surprises,
        messages,
        music
    )
except ImportError:
    from backend.app.database import engine, Base, SessionLocal, BASE_DIR
    from backend.app.services.seed_data import init_seed_data
    from backend.app.routers import (
        auth,
        profile,
        photos,
        memories,
        surprises,
        messages,
        music
    )

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure uploads directory exists
    try:
        os.makedirs(os.path.join(BASE_DIR, "uploads", "photos"), exist_ok=True)
        os.makedirs(os.path.join(BASE_DIR, "uploads", "music"), exist_ok=True)
        os.makedirs(os.path.join(BASE_DIR, "uploads", "memories"), exist_ok=True)
    except Exception:
        pass

    # Initialize seed data
    db = SessionLocal()
    try:
        init_seed_data(db)
    except Exception as e:
        print(f"Seed data warning: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title="Personalized Happy Birthday Wishes API",
    description="Backend API for personalized birthday experience and admin management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def normalize_api_path(request, call_next):
    # If path was stripped of /api by serverless gateway, restore /api for routing
    path = request.scope.get("path", "")
    api_prefixes = ("auth", "profile", "photos", "memories", "surprises", "messages", "music")
    parts = path.strip("/").split("/")
    if parts and parts[0] in api_prefixes:
        request.scope["path"] = "/api" + path
    response = await call_next(request)
    return response

# Mount uploads directory for images and audio
uploads_dir = os.path.join(BASE_DIR, "uploads")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(photos.router)
app.include_router(memories.router)
app.include_router(surprises.router)
app.include_router(messages.router)
app.include_router(music.router)

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Birthday Celebration API", "version": "1.0.0"}

# Serve frontend build in production if available
frontend_dist = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    from starlette.responses import FileResponse

    # Serve static assets from dist
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="static_assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Do not catch API or uploads routes
        if full_path.startswith("api") or full_path.startswith("uploads"):
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
