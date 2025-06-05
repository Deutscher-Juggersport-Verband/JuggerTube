from flask_inputfilter import InputFilter
from flask_inputfilter.validators import InEnumValidator, IsIntegerValidator

from DataDomain.Database.Enum import UserRoleEnum


class UpdateUserRoleInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'userId',
            required=True,
            validators=[
                IsIntegerValidator()
            ]
        )

        self.add(
            'role',
            required=True,
            validators=[
                InEnumValidator(UserRoleEnum)
            ]
        )
