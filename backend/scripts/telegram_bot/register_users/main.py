import os
from pathlib import Path

from telegram.ext import ApplicationBuilder, CommandHandler
from telegram_bot import start, unsubscribe

telegram_bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
if not telegram_bot_token:
    raise ValueError("TELEGRAM_BOT_TOKEN not set in environment variables")


filename = "telegramIds.json"

path = str(Path(__file__).resolve().parent.parent / filename)

if __name__ == '__main__':
    application = ApplicationBuilder().token(telegram_bot_token).build()

    application.add_handlers(
        handlers=[
            CommandHandler('start', start),
            CommandHandler('unsubscribe', unsubscribe)
        ]
    )

    application.run_polling()
