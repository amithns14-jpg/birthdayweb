import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
try:
    from app.database import get_db, BASE_DIR
    from app.models.entities import Photo, Admin
    from app.schemas.schemas import PhotoResponse, PhotoUpdate, PhotoReorderItem
    from app.security import get_current_admin
except ImportError:
    from backend.app.database import get_db, BASE_DIR
    from backend.app.models.entities import Photo, Admin
    from backend.app.schemas.schemas import PhotoResponse, PhotoUpdate, PhotoReorderItem
    from backend.app.security import get_current_admin

router = APIRouter(prefix="/api/photos", tags=["Photos"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 15 * 1024 * 1024 # 15 MB
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "photos")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[PhotoResponse])
def get_photos(db: Session = Depends(get_db)):
    photos = db.query(Photo).order_by(Photo.order_index.asc(), Photo.created_at.desc()).all()
    return photos

@router.post("/upload", response_model=List[PhotoResponse])
async def upload_photos(
    files: List[UploadFile] = File(...),
    captions: Optional[List[str]] = Form(None),
    is_featured: Optional[bool] = Form(False),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    saved_photos = []
    max_order = db.query(Photo).count()

    for idx, file in enumerate(files):
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        unique_name = f"{uuid.uuid4().hex}{ext}"
        destination = os.path.join(UPLOAD_DIR, unique_name)

        # Write file with size limit check
        size = 0
        with open(destination, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    buffer.close()
                    if os.path.exists(destination):
                        os.remove(destination)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"File {file.filename} exceeds maximum size limit of 15MB"
                    )
                buffer.write(chunk)

        caption_val = captions[idx] if captions and idx < len(captions) else ""
        photo_record = Photo(
            file_path=f"/uploads/photos/{unique_name}",
            original_filename=file.filename,
            caption=caption_val,
            is_featured=is_featured if idx == 0 else False,
            order_index=max_order + idx + 1
        )
        db.add(photo_record)
        saved_photos.append(photo_record)

    db.commit()
    for p in saved_photos:
        db.refresh(p)
    return saved_photos

@router.put("/reorder", response_model=List[PhotoResponse])
def reorder_photos(
    items: List[PhotoReorderItem],
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    for item in items:
        photo = db.query(Photo).filter(Photo.id == item.id).first()
        if photo:
            photo.order_index = item.order_index
    db.commit()
    return db.query(Photo).order_by(Photo.order_index.asc()).all()

@router.put("/{photo_id}", response_model=PhotoResponse)
def update_photo(
    photo_id: int,
    data: PhotoUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    if data.caption is not None:
        photo.caption = data.caption
    if data.is_featured is not None:
        if data.is_featured:
            # Unset other featured photos
            db.query(Photo).filter(Photo.id != photo_id).update({Photo.is_featured: False})
        photo.is_featured = data.is_featured
    if data.order_index is not None:
        photo.order_index = data.order_index

    db.commit()
    db.refresh(photo)
    return photo

@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    # If local file, optionally delete from disk
    if photo.file_path.startswith("/uploads/photos/"):
        filename = photo.file_path.replace("/uploads/photos/", "")
        local_file = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(local_file):
            try:
                os.remove(local_file)
            except Exception:
                pass

    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted successfully", "id": photo_id}
