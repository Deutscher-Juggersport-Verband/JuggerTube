from telegram import Update
from telegram.ext import ContextTypes
from user_controller import delete_user_from_json, save_users_to_json


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_chat.id
    user_name = update.effective_chat.username
    save_users_to_json(user_id, user_name)
    await context.bot.send_message(chat_id=update.effective_chat.id, text=f"Hello {user_name}! you have been registered "
                                   f"to the juggertube error log")


async def unsubscribe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_chat.id
    message = delete_user_from_json(user_id)
    await context.bot.send_message(chat_id=update.effective_chat.id, text=message)
