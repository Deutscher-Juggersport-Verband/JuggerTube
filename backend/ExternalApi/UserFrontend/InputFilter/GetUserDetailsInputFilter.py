from flask_inputfilter import InputFilter
from flask_inputfilter.filters import ToNullFilter
from flask_inputfilter.validators import IsStringValidator


class GetUserDetailsInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'escaped_username',
            required=False,
            filters=[ToNullFilter()],
            validators=[
                IsStringValidator()
            ]
        )
