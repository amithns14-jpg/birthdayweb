import os
import uuid
import shutil
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

try:
    from app.database import get_db, BASE_DIR
    from app.models.entities import MusicSetting, Admin
    from app.schemas.schemas import MusicSettingResponse
    from app.security import get_current_admin
except ImportError:
    from backend.app.database import get_db, BASE_DIR
    from backend.app.models.entities import MusicSetting, Admin
    from backend.app.schemas.schemas import MusicSettingResponse
    from backend.app.security import get_current_admin

router = APIRouter(prefix="/api/music", tags=["Music Settings"])

# Safe upload directory
if os.getenv("VERCEL"):
    UPLOAD_DIR = os.path.join("/tmp", "uploads", "music")
else:
    UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "music")

os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".aac", ".flac", ".weba", ".opus"}

class MusicUrlRequest(BaseModel):
    title: str
    url: str
    duration: Optional[str] = "3:00"
    set_active: Optional[bool] = True

@router.get("", response_model=List[MusicSettingResponse])
def get_music_tracks(db: Session = Depends(get_db)):
    return db.query(MusicSetting).order_by(MusicSetting.is_active.desc(), MusicSetting.created_at.desc()).all()

@router.get("/active", response_model=Optional[MusicSettingResponse])
def get_active_music(db: Session = Depends(get_db)):
    track = db.query(MusicSetting).filter(MusicSetting.is_active == True).first()
    if not track:
        track = db.query(MusicSetting).first()
    return track

@router.post("/set-url", response_model=MusicSettingResponse)
def set_music_url(
    data: MusicUrlRequest,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not data.url.strip() or not data.title.strip():
        raise HTTPException(status_code=400, detail="Title and URL cannot be empty")

    if data.set_active:
        db.query(MusicSetting).update({MusicSetting.is_active: False})

    track = MusicSetting(
        title=data.title.strip(),
        file_path=data.url.strip(),
        is_active=data.set_active,
        duration=data.duration or "3:00"
    )
    db.add(track)
    db.commit()
    db.refresh(track)
    return track

@router.post("/upload", response_model=MusicSettingResponse)
async def upload_music(
    title: str = Form(...),
    set_active: Optional[bool] = Form(True),
    duration: Optional[str] = Form("2:30"),
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_AUDIO_EXTENSIONS))}"
        )

    unique_name = f"{uuid.uuid4().hex}{ext}"
    destination = os.path.join(UPLOAD_DIR, unique_name)

    content = await file.read()
    with open(destination, "wb") as buffer:
        buffer.write(content)

    # Also synchronize to frontend/public/uploads/music if directory exists
    try:
        frontend_public_music = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "public", "uploads", "music"))
        if os.path.exists(frontend_public_music):
            shutil.copyfile(destination, os.path.join(frontend_public_music, unique_name))
    except Exception:
        pass

    if set_active:
        db.query(MusicSetting).update({MusicSetting.is_active: False})

    track = MusicSetting(
        title=title,
        file_path=f"/uploads/music/{unique_name}",
        is_active=set_active,
        duration=duration or "2:30"
    )
    db.add(track)
    db.commit()
    db.refresh(track)
    return track

@router.put("/active/{track_id}", response_model=MusicSettingResponse)
def set_active_track(
    track_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    track = db.query(MusicSetting).filter(MusicSetting.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    db.query(MusicSetting).update({MusicSetting.is_active: False})
    track.is_active = True
    db.commit()
    db.refresh(track)
    return track

@router.delete("/{track_id}")
def delete_music(
    track_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    track = db.query(MusicSetting).filter(MusicSetting.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    if track.file_path.startswith("/uploads/music/"):
        filename = track.file_path.replace("/uploads/music/", "")
        local_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(local_path):
            try:
                os.remove(local_path)
            except Exception:
                pass

    db.delete(track)
    db.commit()
    return {"message": "Track deleted successfully", "id": track_id}
