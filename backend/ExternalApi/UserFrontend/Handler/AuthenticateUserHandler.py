from flask import g

from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.UseCase.CommandHandler import LoginUserCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import LoginUserCommand
from DataDomain.Model import Response


class AuthenticateUserHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        email: str | None = data.get('email')

        user = UserRepository.getUserByEmail(email)

        if user is None:
            return Response(
                error='Falsche Anmeldedaten.',
                status=401
            )

        login_user_result = LoginUserCommandHandler.execute(
            LoginUserCommand(
                email=user.email,
                password=data.get('password')
            )
        )

        if not login_user_result:
            return Response(
                error='Falsche Anmeldedaten.',
                status=401
            )

        if login_user_result.token:
            return Response(
                response={
                    'token': login_user_result.token,
                },
                status=200,
            )

        if login_user_result.lockType:
            return Response(
                response={
                    'lockType': login_user_result.lockType,
                    'lockedUntil': login_user_result.lockedUntil
                },
                status=401
            )

        return Response(
            error='Falsche Anmeldedaten.',
            status=401
        )
