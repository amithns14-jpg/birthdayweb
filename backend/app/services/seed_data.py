import os
from sqlalchemy.orm import Session
from backend.app.models.entities import (
    Admin,
    BirthdayProfile,
    Photo,
    BirthdayMessage,
    Memory,
    SurpriseItem,
    MusicSetting
)
from backend.app.security import get_password_hash

def init_seed_data(db: Session):
    # 1. Admin user
    admin = db.query(Admin).first()
    if not admin:
        default_username = os.getenv("ADMIN_USERNAME", "admin")
        default_password = os.getenv("ADMIN_PASSWORD", "birthday2025")
        admin = Admin(
            username=default_username,
            password_hash=get_password_hash(default_password)
        )
        db.add(admin)
        db.commit()
        print(f"Default admin created: {default_username} / {default_password}")

    # 2. Birthday Profile
    profile = db.query(BirthdayProfile).first()
    if not profile:
        profile = BirthdayProfile(
            person_name="Sophia",
            birthday_date="November 16",
            welcome_headline="Hey! Someone Special Has a Birthday Today! ✨",
            hero_subtitle="Today is all about you. May your life always be filled with happiness, love, and unforgettable memories.",
            cake_wish_message="Close your eyes, make the deepest wish in your heart, and blow out the candles! May every dream you whisper to the stars come true! 🎂✨",
            letter_title="A Heartfelt Letter For The Most Wonderful Person",
            letter_content="On your special day, I just want to remind you how amazing you are. May every dream you carry become a beautiful reality. Keep smiling, keep shining, and never stop being the wonderful person you are.\n\nFrom the moment you walk into a room, you bring laughter, genuine warmth, and effortless grace. Having you in this world makes everything so much better, happier, and brighter. You inspire everyone around you to be kinder and to dream bigger.\n\nHere is to another 365 days of wild adventures, spontaneous belly-laughs, dreams coming true, and peace in your heart. Happy Birthday, beautiful soul!",
            letter_signature="With all my warmest love and endless blessings ❤️",
            closing_headline="Once Again, Happy Birthday! 🎂",
            closing_message="May your smile never fade, your dreams never stop, and your happiness never end."
        )
        db.add(profile)
        db.commit()
        print("Default birthday profile initialized.")

    # 3. Photos
    if db.query(Photo).count() == 0:
        sample_photos = [
            Photo(file_path="/uploads/photos/photo_1.jpg", original_filename="magical_sparkle.jpg", caption="Your radiant smile that lights up every room ✨", is_featured=True, order_index=1),
            Photo(file_path="/uploads/photos/photo_2.jpg", original_filename="golden_hour.jpg", caption="Golden hour vibes and endless laughs 🌅", is_featured=False, order_index=2),
            Photo(file_path="/uploads/photos/photo_3.jpg", original_filename="pure_joy.jpg", caption="Pure joy captured in a single frame 💖", is_featured=False, order_index=3),
            Photo(file_path="/uploads/photos/photo_4.jpg", original_filename="starlit_night.jpg", caption="Under the stars, making unforgettable memories 🌌", is_featured=False, order_index=4),
            Photo(file_path="/uploads/photos/photo_5.jpg", original_filename="celebration_cake.jpg", caption="Sweet moments and sweet celebrations 🎂", is_featured=False, order_index=5),
            Photo(file_path="/uploads/photos/photo_6.jpg", original_filename="cherished_smiles.jpg", caption="May this year bring you endless happiness 🌸", is_featured=False, order_index=6),
        ]
        db.add_all(sample_photos)
        db.commit()
        print("Sample photos seeded.")

    # 4. Memories Timeline
    if db.query(Memory).count() == 0:
        sample_memories = [
            Memory(
                title="The Day We First Laughed Non-Stop",
                date_str="A Sunny Afternoon",
                description="That spontaneous afternoon when we couldn't stop laughing until tears streamed down our faces. Some memories stay permanently etched in gold.",
                image_path="/uploads/memories/memory_1.jpg",
                order_index=1
            ),
            Memory(
                title="Coffee Chats & Late Night Talks",
                date_str="Under City Lights",
                description="Talking about big dreams, favorite books, and all the silly secrets. Finding someone who listens with their whole heart is the greatest gift.",
                image_path="/uploads/memories/memory_2.jpg",
                order_index=2
            ),
            Memory(
                title="Celebrating Your Big Milestone",
                date_str="A Day of Triumph",
                description="Watching you achieve something you worked so tirelessly for. Your resilience and determination inspire everyone who knows you.",
                image_path="/uploads/memories/memory_3.jpg",
                order_index=3
            ),
            Memory(
                title="Birthday Eve Anticipation",
                date_str="Every Birthday Eve",
                description="Counting down the seconds to midnight just to be the first to scream 'Happy Birthday!' and celebrate the extraordinary person you are.",
                image_path="/uploads/memories/memory_4.jpg",
                order_index=4
            ),
        ]
        db.add_all(sample_memories)
        db.commit()
        print("Sample memories seeded.")

    # 5. Surprise items
    if db.query(SurpriseItem).count() == 0:
        sample_surprises = [
            SurpriseItem(
                title="Surprise #1: An Eternal Wish Token",
                preview_hint="A tiny box wrapped in rose ribbon...",
                secret_content="🎟️ GOLDEN BIRTHDAY VOUCHER: Good for unlimited warm hugs, midnight ice cream cravings, and lifelong loyalty whenever you need it!",
                badge="Secret Gift",
                order_index=1
            ),
            SurpriseItem(
                title="Surprise #2: 3 Things I Adore About You",
                preview_hint="Tap to unlock 3 heartfelt truths...",
                secret_content="1. Your infectious laugh that turns gloomy days bright.\n2. How deeply and sincerely you care for others.\n3. Your courage to chase whatever sets your soul on fire.",
                badge="Heartfelt Truths",
                order_index=2
            ),
            SurpriseItem(
                title="Surprise #3: The Grand Fortune Prediction",
                preview_hint="Peek into your upcoming year...",
                secret_content="🔮 THE STARS HAVE SPOKEN: This year will bring unexpected joy, thrilling journeys, deeper peace, new milestones achieved, and plenty of cake!",
                badge="Fortune",
                order_index=3
            ),
        ]
        db.add_all(sample_surprises)
        db.commit()
        print("Sample surprises seeded.")

    # 6. Birthday Messages
    if db.query(BirthdayMessage).count() == 0:
        sample_messages = [
            BirthdayMessage(
                sender_name="Alex & Maya",
                relationship="Best Friends",
                message="Happy Birthday to the most energetic, kind, and wonderful soul! May your year be as dazzling as you are!",
                avatar_color="from-purple-500 to-indigo-500"
            ),
            BirthdayMessage(
                sender_name="Mom & Dad",
                relationship="Family",
                message="Watching you grow into such a compassionate and graceful person is our greatest blessing. Keep shining brightly!",
                avatar_color="from-pink-500 to-rose-500"
            ),
            BirthdayMessage(
                sender_name="Jordan",
                relationship="Partner in Crime",
                message="Here's to another year of terrible karaoke, legendary road trips, and laughing at jokes only we understand!",
                avatar_color="from-amber-400 to-orange-500"
            )
        ]
        db.add_all(sample_messages)
        db.commit()
        print("Sample messages seeded.")

    # 7. Music Settings
    if db.query(MusicSetting).count() == 0:
        sample_music = [
            MusicSetting(
                title="Joyful Music Box - Happy Birthday",
                file_path="/uploads/music/birthday_melody.wav",
                is_active=True,
                duration="1:15"
            )
        ]
        db.add_all(sample_music)
        db.commit()
        print("Sample music track seeded.")
