from flask import g
from flask_jwt_extended import get_jwt_identity

from BusinessDomain.User.Rule import IsCurrentUserAdminRule, IsUserAdminRule
from DataDomain.Model import Response


class IsAdminHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        escaped_username: str | None = data.get('escapedUsername')

        if escaped_username is None and get_jwt_identity() is None:
            return Response(
                error='Username or session is required',
                status=400,
            )

        if escaped_username:
            is_admin = IsUserAdminRule.applies(escaped_username)

        else:
            is_admin = IsCurrentUserAdminRule.applies()

        return Response(
            response=is_admin,
            status=200,
        )
