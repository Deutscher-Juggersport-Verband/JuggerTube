from flask_inputfilter import InputFilter
from flask_inputfilter.filters import StringTrimFilter
from flask_inputfilter.validators import IsStringValidator


class CreateNewPasswordInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'hash',
            required=True,
            filters=[
                StringTrimFilter()
            ],
            validators=[IsStringValidator()]
        )

        self.add(
            'password',
            required=True,
            filters=[
                StringTrimFilter()
            ],
            validators=[IsStringValidator()]
        )
