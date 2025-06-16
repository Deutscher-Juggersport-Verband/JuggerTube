from flask_inputfilter import InputFilter
from flask_inputfilter.enums import RegexEnum
from flask_inputfilter.filters import (
    StringTrimFilter,
    ToNullFilter,
)
from flask_inputfilter.validators import (
    ArrayLengthValidator,
    IsArrayValidator,
    IsStringValidator,
    RegexValidator,
)


class CreateTournamentInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'name',
            required=True,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'city',
            required=True,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'startDate',
            required=True,
            validators=[
                RegexValidator(
                    RegexEnum.ISO_DATE.value,
                    'Das Startdatum muss im iso format sein.'
                )
            ]
        )

        self.add(
            'endDate',
            required=False,
            validators=[
                RegexValidator(
                    RegexEnum.ISO_DATE.value,
                    'Das Enddatum muss im iso format sein.'
                )
            ]
        )

        self.add(
            'jtrLink',
            required=True,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )


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
