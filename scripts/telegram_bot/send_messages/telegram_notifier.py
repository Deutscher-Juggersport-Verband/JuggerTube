import os
from telegram.ext import ApplicationBuilder
import asyncio

from scripts.telegram_bot.send_messages.user_controller import read_users_from_json

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN not set in environment variables")

async def send_telegram_status(status_message, error_message=None):
    """Send status message to Telegram
    
    Args:
        status_message (str): Main status message
        error_message (str, optional): Additional error details
    """
    application = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    await application.initialize()
    
    message = f"Statusmeldung: {status_message}"
    if error_message:
        message += f"\nFehlermeldung: {error_message}"

    users = read_users_from_json()
    
    for user in users:
        try:
            await application.bot.send_message(chat_id=user, text=message)
        except Exception as e:
            print(f"Error sending Telegram message: {e}")
    
    await application.stop()

def notify(status_message, error_message=None):
    """Synchronous wrapper for send_telegram_status"""
    asyncio.run(send_telegram_status(status_message, error_message)) 