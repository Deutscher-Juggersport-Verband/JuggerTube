from flask import g

from BusinessDomain.User.Rule import DoesUserExistsRule, IsCurrentUserAdminRule
from config import cache
from DataDomain.Database.Model import Users
from DataDomain.Model import Response


class UpdateUserRoleHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        user_id: int = data.get('userId')

        if not IsCurrentUserAdminRule.applies():
            return Response(403)

        if not DoesUserExistsRule.applies(
            user_id=user_id,
        ):
            return Response(
                error='User not found',
                status=404
            )

        try:
            user = Users.query.get(user_id)

            user.role = data.get('role')

            user.save()

            cache.delete('get-user-short-overview')
            cache.delete('get-privileged-user-short-overview')

        except Exception:
            return Response(status=500)

        return Response(
            status=200
        )
