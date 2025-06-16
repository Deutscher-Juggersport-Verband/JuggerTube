import os
import logging
from telegram import Bot
import asyncio

from scripts.telegram_bot.send_messages.user_controller import read_users_from_json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

telegram_bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
if not telegram_bot_token:
    raise ValueError("TELEGRAM_BOT_TOKEN not set in environment variables")

bot = Bot(token=telegram_bot_token)


async def send_telegram_status(status_message, error_message=None):

    message = f"Statusmeldung: {status_message}"
    if error_message:
        message += f"\nFehlermeldung: {error_message}"

    users = read_users_from_json()

    for user in users:
        try:
            user_id = user['userId']
            chat = await bot.get_chat(chat_id=user_id)
            if not chat:
                logger.warning(f"Chat not found for user_id: {user_id}")
                continue

            await bot.send_message(chat_id=user_id, text=message)

        except Exception as e:
            logger.error(
                f"Error sending Telegram message to user_id {user.get('userId')}: {str(e)}")


def notify(status_message, error_message=None):
    """Synchronous wrapper for send_telegram_status"""
    asyncio.run(send_telegram_status(status_message, error_message))
