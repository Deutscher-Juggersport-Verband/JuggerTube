from flask_jwt_extended import get_jwt_identity

from BusinessDomain.User.Rule import IsCurrentUserPrivilegedRule
from DataDomain.Model import Response


class IsPrivilegedHandler:

    @staticmethod
    def handle() -> Response:

        if get_jwt_identity() is None:
            return Response(
                error='User session is required',
                status=400,
            )

        return Response(
            response=IsCurrentUserPrivilegedRule.applies(),
            status=200,
        )
