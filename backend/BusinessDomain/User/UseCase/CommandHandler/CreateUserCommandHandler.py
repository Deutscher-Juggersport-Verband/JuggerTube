from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from BusinessDomain.User.UseCase.CommandHandler.Command import CreateUserCommand
from DataDomain.Database.Model import Users


class CreateUserCommandHandler:

    @staticmethod
    def execute(command: CreateUserCommand) -> str:

        user = Users()

        user.email = command.email
        user.escaped_username = command.username.lower().replace(' ', '-')
        user.name = command.name
        user.password_hash = generate_password_hash(command.password)
        user.username = command.username

        user_id = user.create()

        access_token = create_access_token(
            identity=user_id
        )

        return access_token
