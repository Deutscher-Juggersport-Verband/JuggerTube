from flask import g

from BusinessDomain.User.Rule.tools import getJwtIdentity
from BusinessDomain.User.UseCase.CommandHandler import UpdateUserPictureCommandHandler
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserPictureCommand
from DataDomain.Model import Response
from ExternalApi.UserFrontend.config import clear_user_cache


class UpdateUserPictureHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        user = getJwtIdentity()

        try:
            filepath = UpdateUserPictureCommandHandler.execute(
                UpdateUserPictureCommand(
                    user_id=user.id,
                    picture_data=data.get('picture')
                )
            )

        except Exception:
            return Response(status=500)

        clear_user_cache(user_id=user.id)

        return Response(
            response=filepath,
            status=200
        )
