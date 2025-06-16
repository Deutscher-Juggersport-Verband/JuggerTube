#!/bin/sh

# Starte Telegram-Bot im Hintergrund
python /app/scripts/telegram_bot/register_users/main.py &

# Starte Cron im Vordergrund
cron -f
