from flask import g

from BusinessDomain.User.Rule import DoesPasswordResetHashExistsRule
from BusinessDomain.User.UseCase.CommandHandler import CreateNewPasswordCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import CreateNewPasswordCommand
from DataDomain.Model import Response


class CreateNewPasswordHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        password_hash: str = data.get('hash')

        if not DoesPasswordResetHashExistsRule.applies(password_hash):
            return Response(
                status=400
            )

        try:
            CreateNewPasswordCommandHandler.execute(
                CreateNewPasswordCommand(
                    hash=password_hash,
                    password=data.get('password')
                )
            )

        except Exception:
            return Response(status=500)

        return Response(
            status=200
        )
