from flask import g
from flask_jwt_extended import get_jwt_identity

from BusinessDomain.User.UseCase.CommandHandler import UpdateUserCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserCommand
from DataDomain.Model import Response
from ExternalApi.UserFrontend.config.extensions import clear_user_cache


class UpdateUserHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        try:
            accessToken = UpdateUserCommandHandler.execute(
                UpdateUserCommand(
                    email=data.get('email'),
                )
            )

            clear_user_cache(get_jwt_identity())

        except Exception:
            return Response(status=500)

        return Response(
            response={
                'token': accessToken,
            },
            status=200
        )
