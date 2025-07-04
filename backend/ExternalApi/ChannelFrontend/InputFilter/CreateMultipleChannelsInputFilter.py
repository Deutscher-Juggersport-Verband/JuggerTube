from flask_inputfilter import InputFilter
from flask_inputfilter.validators import (
    ArrayLengthValidator,
    IsArrayValidator,
)


class CreateMultipleChannelsInputFilter(InputFilter):
    """Input filter for creating multiple channels"""

    def __init__(self):

        self.add(
            'channels',
            required=True,
            validators=[
                IsArrayValidator(),
                ArrayLengthValidator(min_length=1),
            ],
        )
