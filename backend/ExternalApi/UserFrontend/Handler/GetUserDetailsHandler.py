from flask import g
from flask_jwt_extended import get_jwt_identity

from BusinessDomain.User.Rule import DoesUserExistsRule
from BusinessDomain.User.UseCase.QueryHandler import GetUserDetailsQueryHandler
from BusinessDomain.User.UseCase.QueryHandler.Query import GetUserDetailsQuery
from DataDomain.Model import Response


class GetUserDetailsHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        escaped_username: str | None = data.get('escaped_username')

        if escaped_username is None and get_jwt_identity() is None:
            return Response(
                status=400,
                response='Username or session is required')

        if escaped_username is not None and not DoesUserExistsRule.applies(
                escaped_username=escaped_username):
            return Response(
                status=404,
                response='User not found'
            )

        user = GetUserDetailsQueryHandler.execute(
            GetUserDetailsQuery(
                escaped_username=escaped_username
            )
        )

        return Response(
            response=user,
            status=200,
        )
