from flask import current_app
from flask_inputfilter import InputFilter
from flask_inputfilter.validators import (
    IsBase64ImageCorrectSizeValidator,
    IsBase64ImageValidator,
)


class UpdateUserPictureInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'picture',
            required=True,
            validators=[
                IsBase64ImageValidator(),
                IsBase64ImageCorrectSizeValidator(
                    minSize=1,
                    maxSize=current_app.config['MAX_CONTENT_LENGTH'])])
