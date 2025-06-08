from flask import request

from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.Rule.tools import getJwtIdentity
from config import cache


def create_user_cache_key() -> str | None:

    escaped_username = request.view_args.get('escaped_username')

    user = UserRepository.getUserByUsername(escaped_username)

    if user is None:
        return None

    return f"user-{user.id}"


def create_user_admin_cache_key() -> str | None:

    user = getJwtIdentity()

    if user is None:
        return None

    return f"user-admin-{user.id}"


def create_user_privileged_cache_key() -> str | None:

    user = getJwtIdentity()

    if user is None:
        return None

    return f"user-privileged-{user.id}"


def clear_user_cache(user_id: int) -> None:

    cache.delete('user-overview')
    cache.delete('get-user-short-overview')
    cache.delete('get-privileged-user-short-overview')

    cache.delete(f'user-{user_id}')
    cache.delete(f'user-admin-{user_id}')


def clear_user_overview_cache() -> None:

    cache.delete('user-overview')
    cache.delete('get-user-short-overview')
    cache.delete('get-privileged-user-short-overview')


def clear_complete_user_cache() -> None:

    clear_user_overview_cache()

    user_keys = cache.cache._read_client.keys('user-*')
    [cache.delete(key.decode('utf-8')) for key in user_keys]

    user_admin_keys = cache.cache._read_client.keys('user-admin-*')
    [cache.delete(key.decode('utf-8')) for key in user_admin_keys]
