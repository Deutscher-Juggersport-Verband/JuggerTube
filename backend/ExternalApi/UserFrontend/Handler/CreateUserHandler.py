from flask import g

from BusinessDomain.User.Rule import DoesEmailExistsRule, DoesUsernameExistsRule
from BusinessDomain.User.UseCase.CommandHandler import CreateUserCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import CreateUserCommand
from DataDomain.Model import Response
from ExternalApi.UserFrontend.config import clear_user_overview_cache


class CreateUserHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        username: str = data.get('username')
        email: str = data.get('email')

        if DoesUsernameExistsRule.applies(username):
            return Response(
                error='Der Nutzername existiert bereits.',
                status=400,
            )

        if DoesEmailExistsRule.applies(email):
            return Response(
                error='Die E-Mail-Adresse existiert bereits.',
                status=400,
            )

        try:
            access_token = CreateUserCommandHandler.execute(
                CreateUserCommand(
                    username=username,
                    email=email,
                    password=data.get('password'),
                    name=data.get('name'),
                )
            )

        except Exception:
            return Response(status=500)

        clear_user_overview_cache()

        return Response(
            response={
                'token': access_token,
            },
            status=200
        )
