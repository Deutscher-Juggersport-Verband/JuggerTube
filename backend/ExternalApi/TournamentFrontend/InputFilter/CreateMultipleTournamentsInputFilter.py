from flask_inputfilter import InputFilter
from flask_inputfilter.validators import ArrayLengthValidator, IsArrayValidator


class CreateMultipleTournamentsInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'tournaments',
            required=True,
            validators=[
                IsArrayValidator(),
                ArrayLengthValidator(min_length=1),
            ],
        )
