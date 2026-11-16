import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from backend.app.database import get_db, BASE_DIR
from backend.app.models.entities import Memory, Admin
from backend.app.schemas.schemas import MemoryResponse, MemoryCreate, MemoryUpdate
from backend.app.security import get_current_admin

router = APIRouter(prefix="/api/memories", tags=["Memories"])

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "memories")
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.get("", response_model=List[MemoryResponse])
def get_memories(db: Session = Depends(get_db)):
    return db.query(Memory).order_by(Memory.order_index.asc(), Memory.created_at.asc()).all()

@router.post("", response_model=MemoryResponse)
async def create_memory(
    title: str = Form(...),
    date_str: Optional[str] = Form(None),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    order_index: Optional[int] = Form(0),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    image_path = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext in ALLOWED_EXTENSIONS:
            unique_name = f"{uuid.uuid4().hex}{ext}"
            destination = os.path.join(UPLOAD_DIR, unique_name)
            with open(destination, "wb") as buffer:
                shutil_copy = await image.read()
                buffer.write(shutil_copy)
            image_path = f"/uploads/memories/{unique_name}"

    memory = Memory(
        title=title,
        date_str=date_str,
        description=description,
        image_path=image_path,
        order_index=order_index or (db.query(Memory).count() + 1)
    )
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory

@router.put("/{memory_id}", response_model=MemoryResponse)
async def update_memory(
    memory_id: int,
    title: Optional[str] = Form(None),
    date_str: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    order_index: Optional[int] = Form(None),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    if title is not None:
        memory.title = title
    if date_str is not None:
        memory.date_str = date_str
    if description is not None:
        memory.description = description
    if order_index is not None:
        memory.order_index = order_index

    if image and image.filename:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext in ALLOWED_EXTENSIONS:
            unique_name = f"{uuid.uuid4().hex}{ext}"
            destination = os.path.join(UPLOAD_DIR, unique_name)
            with open(destination, "wb") as buffer:
                shutil_copy = await image.read()
                buffer.write(shutil_copy)
            memory.image_path = f"/uploads/memories/{unique_name}"

    db.commit()
    db.refresh(memory)
    return memory

@router.delete("/{memory_id}")
def delete_memory(
    memory_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    if memory.image_path and memory.image_path.startswith("/uploads/memories/"):
        filename = memory.image_path.replace("/uploads/memories/", "")
        local_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(local_path):
            try:
                os.remove(local_path)
            except Exception:
                pass

    db.delete(memory)
    db.commit()
    return {"message": "Memory deleted successfully", "id": memory_id}
