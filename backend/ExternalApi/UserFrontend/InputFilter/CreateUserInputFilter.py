from flask_inputfilter import InputFilter
from flask_inputfilter.enums import RegexEnum
from flask_inputfilter.filters import StringTrimFilter, ToNullFilter
from flask_inputfilter.validators import (
    IsStringValidator,
    RegexValidator,
)


class CreateUserInputFilter(InputFilter):

    def __init__(self) -> None:

        super().__init__()

        self.add(
            'email',
            required=False,
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
            'name',
            required=False,
            filters=[
                StringTrimFilter(),
                ToNullFilter()
            ],
            validators=[IsStringValidator()]
        )

        self.add(
            'password',
            required=True,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'username',
            required=True,
            filters=[
                StringTrimFilter()
            ],
            validators=[IsStringValidator()]
        )
