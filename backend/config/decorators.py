from functools import wraps
from typing import Any, Optional

from flask import current_app
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.exceptions import InvalidHeaderError, NoAuthorizationError
from flask_jwt_extended.view_decorators import LocationType

from BusinessDomain.User.Rule import IsCurrentUserAdminRule, IsCurrentUserPrivilegedRule
from DataDomain.Model import Response


def jwt_guest_required() -> Any:

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
                return Response("Valid token should not be provided", 400)
            except (NoAuthorizationError, InvalidHeaderError):
                pass
            return current_app.ensure_sync(fn)(*args, **kwargs)
        return decorator
    return wrapper


def jwt_privileged_required() -> Any:

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()

            if not IsCurrentUserPrivilegedRule.applies():
                return Response(
                    error="Du besitzt nicht die benötigten Rechte, dies zu tun.",
                    status=403)
            return current_app.ensure_sync(fn)(*args, **kwargs)

        return decorator

    return wrapper


def jwt_admin_required() -> Any:

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()

            if not IsCurrentUserAdminRule.applies():
                return Response(
                    error="Du besitzt nicht die benötigten Rechte, dies zu tun.",
                    status=403)
            return current_app.ensure_sync(fn)(*args, **kwargs)

        return decorator

    return wrapper
