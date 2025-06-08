import io
import os
import uuid

from flask import current_app
from PIL import Image
from werkzeug.utils import secure_filename

from BusinessDomain.Common.Enum import PicturePathEnum, PictureTypeEnum


class PictureService:
    """Service for image manipulation"""

    @staticmethod
    def savePicture(decoded_data: bytes, picture_type: PictureTypeEnum) -> str:
        """Saves a picture to the file system"""

        image, original_format = PictureService.resizePicture(decoded_data)
        filename = PictureService.createPictureName(original_format)
        save_path = PictureService.createPicturePath(filename, picture_type)

        is_animated = getattr(image, 'is_animated', False)

        if is_animated:
            with open(save_path, 'wb') as outFile:
                outFile.write(decoded_data)
        else:
            image.save(save_path, format=original_format)

        return filename

    @staticmethod
    def resizePicture(decoded_picture: bytes) -> tuple[Image, str]:
        """Resizes a picture if it is too large based on its base 4 representation"""

        image = Image.open(io.BytesIO(decoded_picture))
        is_animated = getattr(image, 'is_animated', False)

        original_format = image.format

        if not is_animated and image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')

        max_size = current_app.config['MAX_CONTENT_LENGTH']

        if len(decoded_picture) > max_size:
            if not is_animated:
                scale_factor = (max_size / len(decoded_picture)) ** 0.5
                new_width = int(image.width * scale_factor)
                new_height = int(image.height * scale_factor)
                image = image.resize((new_width, new_height), Image.ANTIALIAS)

            else:
                raise ValueError(
                    'Das GIF ist zu groß, kann aber nicht automatisch skaliert werden.')

        return image, original_format

    @staticmethod
    def createPictureName(original_format: str) -> str:
        """Creates the path to a picture"""

        file_extension = original_format.lower()
        random_hash = uuid.uuid4().hex

        filename = secure_filename(f'{random_hash}.{file_extension}')

        return filename

    @staticmethod
    def createPicturePath(filename: str, picture_type: PictureTypeEnum) -> str:
        """Creates the path to a user picture"""

        if picture_type == PictureTypeEnum.USER:
            folder = PicturePathEnum.USER_PICTURES_FOLDER.value
        elif picture_type == PictureTypeEnum.TEAM:
            folder = PicturePathEnum.TEAM_PICTURES_FOLDER.value
        else:
            raise ValueError('Invalid picture type')

        upload_folder = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            folder)

        save_path = os.path.join(upload_folder, filename)

        return save_path
