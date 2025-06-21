import json

from scripts.telegram_bot.register_users.main import path


def read_users_from_json() -> list[dict]:
    with open(path, 'r') as file:
        users = json.load(file)
    return users
