from flask_inputfilter import InputFilter
from flask_inputfilter.validators import (
    ArrayLengthValidator,
    IsArrayValidator,
    IsStringValidator,
    ArrayElementValidator
)


class CreateTeamInputFilter(InputFilter):
    """Input filter for single team element"""

    def __init__(self):
        super().__init__()

        self.add(
            'name',
            required=True,
            validators=[
                IsStringValidator(),
            ]
        )

        self.add(
            'city',
            required=True,
            validators=[
                IsStringValidator(),
            ]
        )


class CreateMultipleTeamsInputFilter(InputFilter):
    """Input filter for creating multiple teams"""

    def __init__(self):
        """Initializes the CreateMultipleTeamsInputFilter"""
        super().__init__()

        self.add(
            'teams',
            required=True,
            validators=[
                IsArrayValidator(),
                ArrayLengthValidator(min_length=1),
                ArrayElementValidator(CreateTeamInputFilter)
            ],
        )
