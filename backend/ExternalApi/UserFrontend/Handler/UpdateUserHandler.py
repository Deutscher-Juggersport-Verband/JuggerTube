from flask import g
from flask_jwt_extended import get_jwt_identity

from BusinessDomain.User.Rule import DoesEmailExistsRule, DoesUsernameExistsRule
from BusinessDomain.User.UseCase.CommandHandler import UpdateUserCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserCommand
from DataDomain.Model import Response
from ExternalApi.UserFrontend.config.extensions import clear_user_cache


class UpdateUserHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        username = data.get('username')
        if username and DoesUsernameExistsRule.applies(username):
            return Response(
                status=400,
                response={
                    'error': 'Der Nutzername existiert bereits.'
                }
            )

        email = data.get('email')
        if email and DoesEmailExistsRule.applies(email):
            return Response(
                status=400,
                response={
                    'error': 'Die E-Mail-Adresse existiert bereits.'
                }
            )

        try:
            access_token = UpdateUserCommandHandler.execute(
                UpdateUserCommand(
                    email=email,
                    name=data.get('name'),
                    password=data.get('password'),
                    username=username,
                )
            )

            clear_user_cache(get_jwt_identity())

        except Exception:
            return Response(status=500)

        return Response(
            response={
                'token': access_token,
            },
            status=200
        )
