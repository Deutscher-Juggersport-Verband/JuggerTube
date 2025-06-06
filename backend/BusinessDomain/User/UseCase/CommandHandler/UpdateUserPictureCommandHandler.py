import base64

from BusinessDomain.Common.Enum import PictureTypeEnum
from BusinessDomain.Common.Service import PictureService
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserPictureCommand
from DataDomain.Database.Model import Users
from Infrastructure.Logger import logger


class UpdateUserPictureCommandHandler:

    @staticmethod
    def execute(command: UpdateUserPictureCommand) -> str:

        try:
            user = Users.query.get(command.user_id)

            decoded_data = base64.b64decode(command.picture_data)

            user.picture = PictureService.savePicture(
                decoded_data, PictureTypeEnum.USER)

            user.save()

            return user.picture

        except Exception as e:
            logger.error(f'UpdateUserPictureCommandHandler | execute | {e}')
            raise e
