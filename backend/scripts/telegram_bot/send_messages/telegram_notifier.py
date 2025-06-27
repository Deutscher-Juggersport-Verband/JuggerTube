import asyncio
import logging
import os
import sys
from pathlib import Path

from telegram import Bot

from scripts.telegram_bot.send_messages.user_controller import read_users_from_json

# Add the backend directory to Python path for local development
current_dir = Path(__file__).parent
backend_dir = current_dir.parent.parent.parent  # Go up to backend directory
sys.path.insert(0, str(backend_dir))


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

telegram_bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
if not telegram_bot_token:
    logger.info(
        "TELEGRAM_BOT_TOKEN not set in environment variables - Telegram notifications will be skipped")
    bot = None
else:
    bot = Bot(token=telegram_bot_token)


async def send_telegram_status(status_message: str, error_message: str | None = None):
    if not bot:
        logger.info("Skipping Telegram notification - no bot token configured")
        return

    message = f"Statusmeldung: {status_message}"
    if error_message:
        message += f"\nFehlermeldung: {error_message}"

    users: list[dict] = read_users_from_json()

    for user in users:
        try:
            user_id = user.get('userId')

            chat = await bot.get_chat(chat_id=user_id)
            if not chat:
                logger.warning(f"Chat not found for user_id: {user_id}")
                continue

            await bot.send_message(chat_id=user_id, text=message)

        except Exception as e:
            logger.error(
                f"Error sending Telegram message to user_id {
                    user.get('userId')}: {
                    str(e)}")


def notify(status_message: str, error_message: str | None = None):
    """Synchronous wrapper for send_telegram_status"""
    asyncio.run(send_telegram_status(status_message, error_message))
