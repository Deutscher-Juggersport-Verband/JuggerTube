import json
import os

from scripts.telegram_bot.config import TELEGRAM_IDS_PATH


def check_if_user_already_exists(user_to_search_id: int, all_users: list[dict]) -> bool:
    return any(user["userId"] == user_to_search_id for user in all_users)


def save_users_to_json(user_id: int, user_name: str) -> str:
    new_user = {
        "userId": user_id,
        "userName": user_name
    }

    users = []
    if os.path.isfile(TELEGRAM_IDS_PATH):
        try:
            with open(TELEGRAM_IDS_PATH, 'r') as file:
                users = json.load(file)
        except (json.JSONDecodeError, OSError):
            return "error reading user file"

        if check_if_user_already_exists(user_id, users):
            return "user already subscribed to newsletter"

    users.append(new_user)
    try:
        with open(TELEGRAM_IDS_PATH, 'w') as file:
            json.dump(users, file, indent=2)
    except OSError:
        return "error writing user file"

    return "user successfully added"


def delete_user_from_json(user_id):
    if not os.path.isfile(TELEGRAM_IDS_PATH):
        return "user does not exist on database"

    with open(TELEGRAM_IDS_PATH) as file:
        file_users = json.load(file)

        for user in file_users:
            if user['userId'] != user_id:
                return f"user {user['userName']} not found"

            index = list(file_users).index(user)
            del file_users[index]
            return f"user {user['userName']} unsubscribed"
