from flask_inputfilter import InputFilter
from flask_inputfilter.validators import ArrayLengthValidator, IsArrayValidator


class CreateMultipleTeamsInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'teams',
            required=True,
            validators=[
                IsArrayValidator(),
                ArrayLengthValidator(min_length=1),
            ],
        )
