from flask import request

from BusinessDomain.User.Repository import UserRepository
from config import cache


def create_user_cache_key() -> str | None:

    escaped_username = request.view_args.get('escaped_username')

    user = UserRepository.getUserByUsername(escaped_username)

    if user is None:
        return None

    return f"user-{user.id}"


def clear_user_cache(userId: int) -> None:

    cache.delete('user-overview')

    cache.delete(f'user-{userId}')


def clear_complete_user_cache() -> None:

    user_keys = cache.cache._read_client.keys('user-*')

    [cache.delete(key.decode('utf-8')) for key in user_keys]
