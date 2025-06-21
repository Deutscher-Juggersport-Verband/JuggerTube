from flask_inputfilter import InputFilter
from flask_inputfilter.validators import (
    ArrayLengthValidator,
    IsArrayValidator,
    IsStringValidator,
    ArrayElementValidator
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
            ],
        )
