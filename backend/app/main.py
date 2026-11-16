import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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
    os.makedirs(os.path.join(BASE_DIR, "uploads", "photos"), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, "uploads", "music"), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, "uploads", "memories"), exist_ok=True)

    # Initialize seed data
    db = SessionLocal()
    try:
        init_seed_data(db)
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
