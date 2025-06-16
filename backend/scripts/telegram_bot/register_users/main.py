import os

from telegram.ext import ApplicationBuilder, CommandHandler
from telegram_bot import start, unsubscribe

telegram_bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
if not telegram_bot_token:
    raise ValueError("TELEGRAM_BOT_TOKEN not set in environment variables")

if __name__ == '__main__':
    application = ApplicationBuilder().token(telegram_bot_token).build()

    start_handler = CommandHandler('start', start)
    application.add_handler(start_handler)
    unsubscribe_handler = CommandHandler('unsubscribe', unsubscribe)
    application.add_handler(unsubscribe_handler)

    application.run_polling()
