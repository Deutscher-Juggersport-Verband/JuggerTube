import json
import os

filename = "telegramIds.json"


def get_parent(levels=1):
    current_directory = os.path.dirname(__file__)
    parent_directory = current_directory
    for i in range(0, levels):
        parent_directory = os.path.split(parent_directory)[0]
    file_path = os.path.join(parent_directory, filename)
    return file_path


def read_users_from_json():
    try:
        with open(get_parent(), 'r') as file:
            users = json.load(file)
        return users
    except FileNotFoundError:
        print(f"Error: File {get_parent()} not found.")
        return None;