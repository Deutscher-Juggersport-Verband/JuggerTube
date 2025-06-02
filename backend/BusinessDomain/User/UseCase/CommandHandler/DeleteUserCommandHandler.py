from BusinessDomain.User.UseCase.CommandHandler.Command import DeleteUserCommand
from DataDomain.Database.Model import Users


class DeleteUserCommandHandler:

    @staticmethod
    def execute(command: DeleteUserCommand) -> None:

        user = Users.query.get(command.userId)

        user.shadow()
