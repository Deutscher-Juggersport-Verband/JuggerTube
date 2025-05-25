from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.Rule.tools import getJwtIdentity
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserCommand


class UpdateUserCommandHandler:

    @staticmethod
    def execute(command: UpdateUserCommand) -> str:

        user = getJwtIdentity()

        email = command.email
        if email:
            user.email = email

        name = command.name
        if name:
            user.name = name

        password = command.password
        if password:
            user.password = generate_password_hash(password)

        username = command.username
        if username:
            user.username = username

        UserRepository.update(user.id)

        return create_access_token(
            identity=user.id
        )
