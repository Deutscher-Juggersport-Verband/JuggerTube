import base64

from BusinessDomain.Common.Enum import PictureTypeEnum
from BusinessDomain.Common.Service import PictureService
from BusinessDomain.User.Rule.tools import getJwtIdentity
from BusinessDomain.User.UseCase.CommandHandler.Command import UpdateUserPictureCommand
from Infrastructure.Logger import logger


class UpdateUserPictureCommandHandler:

    @staticmethod
    def execute(command: UpdateUserPictureCommand) -> str:

        try:
            user = getJwtIdentity()

            decoded_data = base64.b64decode(command.pictureData)

            user.picture = PictureService.savePicture(
                decoded_data, PictureTypeEnum.USER)

            user.save()

            return user.picture

        except Exception as e:
            logger.error(f'UpdateUserPictureCommandHandler | execute | {e}')
            raise e
