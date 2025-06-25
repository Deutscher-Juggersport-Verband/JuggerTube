from scripts.telegram_bot.config import TELEGRAM_IDS_PATH
import json
import sys
from pathlib import Path

# Add the backend directory to Python path for local development
current_dir = Path(__file__).parent
backend_dir = current_dir.parent.parent.parent  # Go up to backend directory
sys.path.insert(0, str(backend_dir))


def read_users_from_json() -> list[dict]:
    with open(TELEGRAM_IDS_PATH, 'r') as file:
        users = json.load(file)
    return users
