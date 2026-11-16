# 🎂 Personalized Happy Birthday Wishes Website (Full-Stack)

A complete, production-ready, personalized Happy Birthday Celebration web application built with **React 18, Vite, Tailwind CSS, Framer Motion, Python FastAPI, and SQLAlchemy ORM**.

Designed with emotional elegance, glassmorphism, floating balloons, drifting hearts, interactive 3D elements, blowable cake candles, polaroid photo memories, an unfolding wax-sealed letter, unwrap-able surprise gifts, a background music player with visualizer, and a full-featured Admin Studio.

---

## ✨ Key Features & Experience Modules

### 1. 🌟 Page 1: Welcome Screen
* Full-screen magical entrance with animated gradient meshes.
* Floating balloons, drifting rose-gold hearts, and sparkling twinkling stars.
* Grand headline: *"Hey! Someone Special Has a Birthday Today! ✨"*.
* Glowing *"Open Your Surprise"* button with pulse aura and celebratory particle burst that unlocks the celebration and triggers the background music.

### 2. 🎂 Page 2: Birthday Hero Section & Interactive Cake
* Large personalized typography: *"HAPPY BIRTHDAY, [PERSON NAME]!"*.
* Illustrated multi-tier birthday cake with dripping frosting, sprinkles, and authentic candles.
* **Interactive Candles**: Click the cake or the *"Make a Wish"* button to blow out the candles with realistic flickering flames extinguishing into rising smoke particles.
* Heartfelt wish confirmation card revealed with multi-stage confetti celebration.
* Option to relight the candles at any time.

### 3. 📸 Page 3: Selected Photo Gallery (Polaroid Aesthetic)
* Vintage Polaroid-style photo cards with authentic washi tape, gentle tilt angles, and soft drop shadows.
* Hover zoom and glow effects.
* Captions for every photograph and featured badge highlights.
* **Full-featured Lightbox**: Next/previous navigation, keyboard arrow support (`Left`, `Right`, `Escape`), and image zoom.
* Real uploaded photographs served without placeholders.

### 4. ⏳ Page 4: Interactive Memories Timeline
* Chronological milestone timeline with connected glowing center nodes and pulsing hearts.
* Staggered scroll animations powered by Framer Motion.
* Cards complete with photograph, milestone title, date/season badge, and storytelling description.

### 5. 💌 Page 5: Personalized Birthday Letter
* Realistic envelope with an authentic crimson wax seal and golden heart stamp.
* Interactive letter opening: Clicking the seal breaks the wax with confetti and unfolds an elegant parchment letter.
* Editorial typography featuring *Playfair Display* and romantic *Great Vibes* cursive signature.
* Fully customizable through the Admin Studio.

### 6. 🎁 Page 6: Interactive 3D Gift Box Surprises
* Interactive gift box wrapped with golden ribbons and bow.
* **Click to Unwrap**: The lid flies off with a burst of confetti and reveals surprise cards.
* Hidden secret cards, golden lifetime vouchers, and birthday truths that can be individually unlocked/revealed.

### 7. 💬 Community Guestbook Wishes Wall
* Loved ones and friends can leave warm birthday blessings directly on the site.
* Avatar badges with custom colors and relationship tags (*Best Friend*, *Family*, *Partner*, etc.).
* Instant optimistic update without page reloads.

### 8. 🎶 Page 7: Persistent Floating Birthday Music Player
* Floating glassmorphic dock with an animated rotating vinyl disc.
* Real-time audio visualizer frequency bars dancing during playback.
* Play/pause toggle, mute/unmute, volume slider, and track scrubber.
* Complies with browser autoplay guidelines (starts smoothly upon first visitor interaction).
* Bundled soothing music-box "Happy Birthday" melody; admin can upload custom MP3/WAV tracks.

### 9. 🎆 Page 8: Grand Finale Celebration
* Closing celebration: *"Once Again, Happy Birthday! May your smile never fade..."*.
* Grand multi-burst fireworks and confetti animation.
* *"Replay Grand Celebration"* button to experience the magic again.
* One-click *"Share Celebration"* link copy button.

### 10. 🔐 Admin Studio & Content Management
* Protected modal accessible from the navbar with JWT authentication.
* **Profile Settings**: Edit person's name, birthdate, welcome text, hero subtitle, cake wish, closing message.
* **Photos Management**: Multi-file upload (`.jpg`, `.jpeg`, `.png`, `.webp`), live previews, caption editing, featured toggle, up/down reordering, deletion.
* **Memories Management**: Add/edit/delete timeline milestones with images and storytelling descriptions.
* **Surprise Management**: Create and edit secret cards and vouchers.
* **Letter Editor**: Full WYSIWYG editing of the parchment letter and cursive signature.
* **Music Management**: Upload new audio tracks and set active celebration melody.
* **Security**: Update admin password directly from the studio.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion 12, Lucide React, Canvas-Confetti |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Database** | SQLite (development) / PostgreSQL (production) via SQLAlchemy 2.0 ORM |
| **Security** | Passlib, BCrypt password hashing, Python-Jose (JWT tokens) |
| **Media** | Static serving from `/uploads/` with Cloudinary-ready structure |

---

## 📁 Project Structure

```
c:\Birthday website\
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── entities.py       # Admin, BirthdayProfile, Photo, Memory, SurpriseItem, Music
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py        # Pydantic schemas for requests and responses
│   │   ├── routers/
│   │   │   ├── auth.py           # Login, verify, change password
│   │   │   ├── profile.py        # Get & update birthday profile
│   │   │   ├── photos.py         # Multi-upload, reorder, update captions, delete
│   │   │   ├── memories.py       # Add, update, delete timeline memories
│   │   │   ├── surprises.py      # Manage surprise cards and secrets
│   │   │   ├── messages.py       # Guestbook wishes
│   │   │   └── music.py          # Music uploads and active track selector
│   │   ├── services/
│   │   │   └── seed_data.py      # Auto-initialization with sample photos, memories & audio
│   │   ├── database.py           # SQLAlchemy engine & session
│   │   ├── security.py           # BCrypt password hashing & JWT auth
│   │   └── main.py               # FastAPI app, CORS, static files & SPA fallback
│   ├── uploads/
│   │   ├── photos/               # Uploaded gallery photos
│   │   ├── memories/             # Uploaded timeline images
│   │   └── music/                # Audio files (birthday melody)
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── BackgroundEffects.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── HeroCakeSection.jsx
│   │   │   ├── PhotoGallery.jsx
│   │   │   ├── MemoriesTimeline.jsx
│   │   │   ├── BirthdayLetter.jsx
│   │   │   ├── SurpriseSection.jsx
│   │   │   ├── GuestWishes.jsx
│   │   │   ├── FinalCelebration.jsx
│   │   │   ├── MusicPlayer.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js            # REST API client with auth token management
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind utilities, glassmorphism, candle animations
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── run_app.py                    # One-command full-stack runner
├── start_server.bat              # Windows batch launcher
├── README.md
└── .gitignore
```

---

## 🚀 Quickstart Guide (Local Development)

### 1. Run Everything With One Command
You can launch the complete full-stack website (Backend + Frontend + Database) using Python:
```bash
python run_app.py
```
Or on Windows, simply double-click `start_server.bat`!

Open your browser at:
👉 **[http://localhost:8000](http://localhost:8000)**

### 2. Admin Credentials
Click the **"Admin"** button in the top right corner of the website:
* **Username**: `admin`
* **Default Password**: `birthday2025`

*(You can change the password at any time inside the Admin Studio -> Security tab).*

---

## 💻 Separate Frontend & Backend Development

If you wish to run the Vite dev server with Hot Module Replacement (HMR):

### Terminal 1: Backend
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Terminal 2: Frontend
```bash
cd frontend
pnpm run dev
# or npm run dev
```
Vite runs at `http://localhost:5173` and proxies API requests automatically to the backend on `8000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | Public |
| `GET` | `/api/profile` | Retrieve birthday profile details | Public |
| `PUT` | `/api/profile` | Update profile information | Admin Bearer |
| `GET` | `/api/photos` | List all photos in display order | Public |
| `POST` | `/api/photos/upload` | Upload photos with captions | Admin Bearer |
| `PUT` | `/api/photos/reorder` | Reorder photos | Admin Bearer |
| `PUT` | `/api/photos/{id}` | Update photo caption / featured | Admin Bearer |
| `DELETE` | `/api/photos/{id}` | Delete photo | Admin Bearer |
| `GET` | `/api/memories` | Retrieve milestone timeline | Public |
| `POST` | `/api/memories` | Add memory milestone | Admin Bearer |
| `PUT` | `/api/memories/{id}` | Update memory milestone | Admin Bearer |
| `DELETE` | `/api/memories/{id}` | Delete memory milestone | Admin Bearer |
| `GET` | `/api/surprises` | Retrieve surprise cards | Public |
| `POST` | `/api/surprises` | Create surprise card | Admin Bearer |
| `DELETE` | `/api/surprises/{id}` | Delete surprise card | Admin Bearer |
| `GET` | `/api/messages` | Read guestbook wishes | Public |
| `POST` | `/api/messages` | Post a guest birthday wish | Public |
| `GET` | `/api/music/active` | Get active audio track | Public |
| `POST` | `/api/music/upload` | Upload audio file (.mp3/.wav) | Admin Bearer |
| `PUT` | `/api/music/active/{id}` | Set active track | Admin Bearer |
| `POST` | `/api/auth/login` | Admin login & JWT token | Public |
| `GET` | `/api/auth/verify` | Verify token validity | Admin Bearer |
| `POST` | `/api/auth/change-password` | Update admin password | Admin Bearer |

---

## 🌐 Production Deployment Guide

### Option A: All-In-One Deployment on Render / Railway / Fly.io
Since the FastAPI backend serves the compiled React frontend `dist/` and media assets, you can deploy the entire repository as a single web service:

1. Build the frontend:
   ```bash
   cd frontend
   pnpm run build
   ```
2. Set Environment Variables on your hosting provider:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/dbname
   SECRET_KEY=generate-a-strong-random-secret-key-32-chars
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-birthday-password
   PORT=8000
   ```
3. Set Start Command:
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
   ```

### Option B: Separate Frontend (Vercel / Netlify) + Backend (Render)
1. **Frontend (Vercel / Netlify)**:
   * Build command: `pnpm run build`
   * Output directory: `dist`
   * Root directory: `frontend`
   * Environment variable: `VITE_API_BASE=https://your-backend.onrender.com`
2. **Backend (Render)**:
   * Build command: `pip install -r backend/requirements.txt`
   * Start command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

### Option C: Cloudinary Media Integration (Optional)
To use Cloudinary for cloud image hosting in production, set:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
The photo upload router will automatically pipe files directly to Cloudinary when these environment variables are provided.

---

## 💖 Made with Love
Crafted with elegance, modern aesthetics, and celebration cheer. May it bring immense joy, laughter, and unforgettable memories to the birthday star! 🎂✨
