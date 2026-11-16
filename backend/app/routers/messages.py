from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.entities import BirthdayMessage, Admin
from backend.app.schemas.schemas import BirthdayMessageResponse, BirthdayMessageCreate
from backend.app.security import get_current_admin

router = APIRouter(prefix="/api/messages", tags=["Birthday Messages"])

@router.get("", response_model=List[BirthdayMessageResponse])
def get_messages(db: Session = Depends(get_db)):
    return db.query(BirthdayMessage).order_by(BirthdayMessage.created_at.desc()).all()

@router.post("", response_model=BirthdayMessageResponse)
def post_message(data: BirthdayMessageCreate, db: Session = Depends(get_db)):
    if not data.sender_name.strip() or not data.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and message cannot be empty"
        )
    msg = BirthdayMessage(
        sender_name=data.sender_name.strip(),
        relationship=data.relationship.strip() if data.relationship else "Friend",
        message=data.message.strip(),
        avatar_color=data.avatar_color or "from-pink-400 to-rose-400"
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    msg = db.query(BirthdayMessage).filter(BirthdayMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"message": "Message deleted successfully", "id": message_id}
