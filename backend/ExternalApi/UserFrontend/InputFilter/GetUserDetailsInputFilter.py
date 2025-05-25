from flask_inputfilter import InputFilter
from flask_inputfilter.filters import ToNullFilter
from flask_inputfilter.validators import IsStringValidator


class GetUserDetailsInputFilter(InputFilter):

    def __init__(self) -> None:

        super().__init__()

        self.add(
            'escapedUsername',
            required=False,
            filters=[ToNullFilter()],
            validators=[
                IsStringValidator()
            ]
        )
