from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
try:
    from app.database import get_db
    from app.models.entities import SurpriseItem, Admin
    from app.schemas.schemas import SurpriseItemResponse, SurpriseItemCreate, SurpriseItemUpdate
    from app.security import get_current_admin
except ImportError:
    from backend.app.database import get_db
    from backend.app.models.entities import SurpriseItem, Admin
    from backend.app.schemas.schemas import SurpriseItemResponse, SurpriseItemCreate, SurpriseItemUpdate
    from backend.app.security import get_current_admin

router = APIRouter(prefix="/api/surprises", tags=["Surprises"])

@router.get("", response_model=List[SurpriseItemResponse])
def get_surprises(db: Session = Depends(get_db)):
    return db.query(SurpriseItem).order_by(SurpriseItem.order_index.asc()).all()

@router.post("", response_model=SurpriseItemResponse)
def create_surprise(
    data: SurpriseItemCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = SurpriseItem(
        title=data.title,
        preview_hint=data.preview_hint or "Click to open this surprise!",
        secret_content=data.secret_content,
        image_path=data.image_path,
        badge=data.badge or "Surprise",
        order_index=data.order_index or (db.query(SurpriseItem).count() + 1)
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=SurpriseItemResponse)
def update_surprise(
    item_id: int,
    data: SurpriseItemUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(SurpriseItem).filter(SurpriseItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Surprise item not found")

    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if val is not None:
            setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_surprise(
    item_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(SurpriseItem).filter(SurpriseItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Surprise item not found")

    db.delete(item)
    db.commit()
    return {"message": "Surprise deleted successfully", "id": item_id}
