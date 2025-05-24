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

        user = UserRepository.getUserByUsernameOrEmail(email)

        if user is None:
            return Response(
                response='Falsche Anmeldedaten.',
                status=401
            )

        login_user_result = LoginUserCommandHandler.execute(
            LoginUserCommand(
                username=user.username,
                email=user.email,
                password=data.get('password')
            )
        )

        if not login_user_result:
            return Response(
                response='Falsche Anmeldedaten.',
                status=401
            )

        if login_user_result.token is not None:
            return Response(
                response={
                    'token': login_user_result.token,
                    'language': user.language,
                },
                status=200,
            )

        if login_user_result.lockType is not None:
            return Response(
                response={
                    'lockType': login_user_result.lockType,
                    'lockedUntil': login_user_result.lockedUntil
                },
                status=401
            )

        return Response(
            response='Falsche Anmeldedaten.',
            status=401
        )
