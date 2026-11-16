from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
try:
    from app.database import get_db
    from app.models.entities import BirthdayProfile, Admin
    from app.schemas.schemas import ProfileResponse, ProfileUpdate
    from app.security import get_current_admin
except ImportError:
    from backend.app.database import get_db
    from backend.app.models.entities import BirthdayProfile, Admin
    from backend.app.schemas.schemas import ProfileResponse, ProfileUpdate
    from backend.app.security import get_current_admin

router = APIRouter(prefix="/api/profile", tags=["Birthday Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(BirthdayProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Birthday profile not found")
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    data: ProfileUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    profile = db.query(BirthdayProfile).first()
    if not profile:
        profile = BirthdayProfile()
        db.add(profile)

    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
