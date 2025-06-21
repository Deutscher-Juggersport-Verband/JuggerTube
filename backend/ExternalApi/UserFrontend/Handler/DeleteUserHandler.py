from BusinessDomain.User.Rule.tools import getJwtIdentity
from BusinessDomain.User.UseCase.CommandHandler import DeleteUserCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import DeleteUserCommand
from DataDomain.Database.Model import Users
from DataDomain.Model import Response
from ExternalApi.UserFrontend.config import clear_user_cache


class DeleteUserHandler:

    @staticmethod
    def handle() -> Response:

        current_user: Users = getJwtIdentity()

        if current_user.is_deleted:
            return Response(status=404)

        try:
            DeleteUserCommandHandler.execute(
                DeleteUserCommand(
                    user_id=current_user.id
                )
            )

        except Exception:
            return Response(status=500)

        clear_user_cache(user_id=current_user.id)

        return Response(status=200)
