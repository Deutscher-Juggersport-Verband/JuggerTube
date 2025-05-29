from flask_inputfilter import InputFilter
from flask_inputfilter.filters import ToIntegerFilter
from flask_inputfilter.validators import IsIntegerValidator


class GetPaginatedVideosInputFilter(InputFilter):

    def __init__(self):

        self.add(
            'start',
            required=True,
            filters=[
                ToIntegerFilter()
            ],
            validators=[
                IsIntegerValidator(),
            ],
        )

        self.add(
            'limit',
            required=True,
            filters=[
                ToIntegerFilter()
            ],
            validators=[
                IsIntegerValidator(),
            ],
        )
