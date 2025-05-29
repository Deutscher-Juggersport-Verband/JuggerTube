from flask import g

from BusinessDomain.User.Rule import IsCurrentUserAdminRule
from DataDomain.Model import Response


class IsAdminHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        is_admin = IsCurrentUserAdminRule.applies()

        return Response(
            response=is_admin,
            status=200,
        )
