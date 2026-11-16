import os
import sys

# Ensure backend directory is in sys.path
api_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(api_dir)
backend_dir = os.path.join(project_root, "backend")

for p in [backend_dir, project_root]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from app.main import app
except ImportError:
    from backend.app.main import app
