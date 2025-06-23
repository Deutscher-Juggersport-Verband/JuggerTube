import os
import sys
from pathlib import Path

from telegram.ext import ApplicationBuilder, CommandHandler

# Add the backend directory to Python path for local development
current_dir = Path(__file__).parent
backend_dir = current_dir.parent.parent.parent  # Go up to backend directory
sys.path.insert(0, str(backend_dir))

from scripts.telegram_bot.register_users.telegram_bot import start, unsubscribe

telegram_bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
if not telegram_bot_token:
    raise ValueError("TELEGRAM_BOT_TOKEN not set in environment variables")


if __name__ == '__main__':
    application = ApplicationBuilder().token(telegram_bot_token).build()

    application.add_handlers(
        handlers=[
            CommandHandler('start', start),
            CommandHandler('unsubscribe', unsubscribe)
        ]
    )

    application.run_polling()
