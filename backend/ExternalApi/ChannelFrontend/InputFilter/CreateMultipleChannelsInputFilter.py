from flask_inputfilter import InputFilter
from flask_inputfilter.validators import (
    ArrayElementValidator,
    ArrayLengthValidator,
    IsArrayValidator,
    IsStringValidator,
)


class CreateMultipleChannelsChannelInputFilter(InputFilter):
    """Input filter for single channel element for creating
    multiple channels"""

    def __init__(self):

        self.add(
            'name',
            required=True,
            validators=[
                IsStringValidator(),
            ]
        )

        self.add(
            'channelLink',
            required=True,
            validators=[
                IsStringValidator(),
            ]
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
                ArrayElementValidator(CreateMultipleChannelsChannelInputFilter)
            ],
        )
