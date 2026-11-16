import os
import sys
import uvicorn

if __name__ == "__main__":
    # Ensure current dir is in PYTHONPATH
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    print("=" * 60)
    print("🎂 Starting Happy Birthday Wishes Full-Stack Website")
    print("✨ Frontend SPA + Backend REST API + Media Storage")
    print("🌐 Open your browser at: http://localhost:8000")
    print("🔐 Admin Dashboard Login:")
    print("   Username: admin")
    print("   Password: birthday2025")
    print("=" * 60)

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False)
