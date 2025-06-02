from flask_inputfilter import InputFilter
from flask_inputfilter.validators import InEnumValidator, IsIntegerValidator

from DataDomain.Database.Enum import VideoStatusEnum


class UpdatePendingVideoStatusInputFilter(InputFilter):

    def __init__(self) -> None:

        super().__init__()

        self.add(
            'videoId',
            required=True,
            validators=[
                IsIntegerValidator()
            ]
        )

        self.add(
            'status',
            required=True,
            validators=[
                InEnumValidator(VideoStatusEnum)
            ]
        )
