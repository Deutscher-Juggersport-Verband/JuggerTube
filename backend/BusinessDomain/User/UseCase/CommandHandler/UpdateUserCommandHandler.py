from flask_jwt_extended import create_access_token

from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.Rule.tools import getJwtIdentity
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserCommand


class UpdateUserCommandHandler:

    @staticmethod
    def execute(command: UpdateUserCommand) -> str:

        user = getJwtIdentity()

        email = command.email
        if email is not None:
            user.email = email

        UserRepository.update(user.id)

        return create_access_token(
            identity=user.id
        )
