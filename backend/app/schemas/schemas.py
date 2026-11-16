from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminChangePassword(BaseModel):
    old_password: str
    new_password: str

# Profile schemas
class ProfileBase(BaseModel):
    person_name: str
    birthday_date: Optional[str] = "November 16"
    welcome_headline: str
    hero_subtitle: str
    cake_wish_message: str
    letter_title: str
    letter_content: str
    letter_signature: str
    closing_headline: str
    closing_message: str

class ProfileUpdate(BaseModel):
    person_name: Optional[str] = None
    birthday_date: Optional[str] = None
    welcome_headline: Optional[str] = None
    hero_subtitle: Optional[str] = None
    cake_wish_message: Optional[str] = None
    letter_title: Optional[str] = None
    letter_content: Optional[str] = None
    letter_signature: Optional[str] = None
    closing_headline: Optional[str] = None
    closing_message: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Photo schemas
class PhotoBase(BaseModel):
    caption: Optional[str] = ""
    is_featured: bool = False
    order_index: int = 0

class PhotoUpdate(BaseModel):
    caption: Optional[str] = None
    is_featured: Optional[bool] = None
    order_index: Optional[int] = None

class PhotoReorderItem(BaseModel):
    id: int
    order_index: int

class PhotoResponse(BaseModel):
    id: int
    file_path: str
    original_filename: Optional[str] = None
    caption: Optional[str] = ""
    is_featured: bool
    order_index: int
    created_at: datetime

    class Config:
        from_attributes = True

# Memory schemas
class MemoryBase(BaseModel):
    title: str
    date_str: Optional[str] = None
    description: str
    image_path: Optional[str] = None
    order_index: int = 0

class MemoryCreate(BaseModel):
    title: str
    date_str: Optional[str] = None
    description: str
    image_path: Optional[str] = None
    order_index: Optional[int] = 0

class MemoryUpdate(BaseModel):
    title: Optional[str] = None
    date_str: Optional[str] = None
    description: Optional[str] = None
    image_path: Optional[str] = None
    order_index: Optional[int] = None

class MemoryResponse(MemoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Message schemas
class BirthdayMessageCreate(BaseModel):
    sender_name: str
    relationship: Optional[str] = "Friend"
    message: str
    avatar_color: Optional[str] = "from-pink-400 to-rose-400"

class BirthdayMessageResponse(BaseModel):
    id: int
    sender_name: str
    relationship: str
    message: str
    avatar_color: str
    created_at: datetime

    class Config:
        from_attributes = True

# Surprise schemas
class SurpriseItemBase(BaseModel):
    title: str
    preview_hint: str
    secret_content: str
    image_path: Optional[str] = None
    badge: str = "Surprise"
    order_index: int = 0

class SurpriseItemCreate(BaseModel):
    title: str
    preview_hint: Optional[str] = "Click to open this surprise!"
    secret_content: str
    image_path: Optional[str] = None
    badge: Optional[str] = "Surprise"
    order_index: Optional[int] = 0

class SurpriseItemUpdate(BaseModel):
    title: Optional[str] = None
    preview_hint: Optional[str] = None
    secret_content: Optional[str] = None
    image_path: Optional[str] = None
    badge: Optional[str] = None
    order_index: Optional[int] = None

class SurpriseItemResponse(SurpriseItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Music schemas
class MusicSettingResponse(BaseModel):
    id: int
    title: str
    file_path: str
    is_active: bool
    duration: str
    created_at: datetime

    class Config:
        from_attributes = True
