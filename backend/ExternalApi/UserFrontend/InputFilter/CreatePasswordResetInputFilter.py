from flask_inputfilter import InputFilter
from flask_inputfilter.filters import StringTrimFilter
from flask_inputfilter.validators import IsStringValidator


class CreatePasswordResetInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'email',
            required=True,
            filters=[
                StringTrimFilter()
            ],
            validators=[IsStringValidator()]
        )
