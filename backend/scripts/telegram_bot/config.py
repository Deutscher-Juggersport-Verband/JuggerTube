import os
from pathlib import Path

current_dir = Path(__file__).parent

TELEGRAM_IDS_PATH = os.path.join(current_dir, 'telegram_users.json')
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
