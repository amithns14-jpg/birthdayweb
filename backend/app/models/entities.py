from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
try:
    from app.database import Base
except ImportError:
    from backend.app.database import Base

class Admin(Base):
    __tablename__ = "admins"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class BirthdayProfile(Base):
    __tablename__ = "birthday_profile"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    person_name = Column(String(100), default="Precious One", nullable=False)
    birthday_date = Column(String(50), default="November 16")
    welcome_headline = Column(String(200), default="Hey! Someone Special Has a Birthday Today! ✨")
    hero_subtitle = Column(Text, default="Today is all about you. May your life always be filled with happiness, love, and unforgettable memories.")
    cake_wish_message = Column(Text, default="May every single wish you made while blowing out the candles come true with extra sprinkles of joy!")
    letter_title = Column(String(200), default="A Heartfelt Letter For Your Special Day")
    letter_content = Column(Text, default="On your special day, I just want to remind you how amazing you are. May every dream you carry become a beautiful reality. Keep smiling, keep shining, and never stop being the wonderful person you are.\n\nYou bring a rare warmth and brightness to everyone around you. Having you in this world makes everything so much better, happier, and more colorful. May this upcoming year unfold with boundless laughter, cozy moments, great achievements, and peace in your heart.")
    letter_signature = Column(String(100), default="With all my warmest love and endless blessings ❤️")
    closing_headline = Column(String(200), default="Once Again, Happy Birthday! 🎂")
    closing_message = Column(Text, default="May your smile never fade, your dreams never stop, and your happiness never end.")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Photo(Base):
    __tablename__ = "photos"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=True)
    caption = Column(String(255), default="")
    is_featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class BirthdayMessage(Base):
    __tablename__ = "birthday_messages"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    sender_name = Column(String(100), nullable=False)
    relationship = Column(String(100), default="Friend")
    message = Column(Text, nullable=False)
    avatar_color = Column(String(50), default="from-pink-400 to-rose-400")
    created_at = Column(DateTime, default=datetime.utcnow)

class Memory(Base):
    __tablename__ = "memories"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    date_str = Column(String(50), nullable=True)
    description = Column(Text, nullable=False)
    image_path = Column(String(255), nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class SurpriseItem(Base):
    __tablename__ = "surprise_items"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    preview_hint = Column(String(200), default="Click to open this surprise!")
    secret_content = Column(Text, nullable=False)
    image_path = Column(String(255), nullable=True)
    badge = Column(String(50), default="Surprise")
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class MusicSetting(Base):
    __tablename__ = "music_settings"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    file_path = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False)
    duration = Column(String(20), default="2:30")
    created_at = Column(DateTime, default=datetime.utcnow)
