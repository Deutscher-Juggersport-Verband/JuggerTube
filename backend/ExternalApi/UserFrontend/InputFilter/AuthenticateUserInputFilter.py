from flask_inputfilter import InputFilter
from flask_inputfilter.enums import RegexEnum
from flask_inputfilter.filters import StringTrimFilter, ToNullFilter
from flask_inputfilter.validators import IsStringValidator, RegexValidator


class AuthenticateUserInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'email',
            required=True,
            filters=[
                StringTrimFilter(),
                ToNullFilter()
            ],
            validators=[
                RegexValidator(
                    RegexEnum.EMAIL.value,
                    'Die Email muss das Format einer Email haben.'
                )
            ]
        )

        self.add(
            'password',
            required=True,
            filters=[
                StringTrimFilter()
            ],
            validators=[IsStringValidator()]
        )
