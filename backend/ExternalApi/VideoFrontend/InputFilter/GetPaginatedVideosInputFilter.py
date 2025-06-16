from flask_inputfilter import InputFilter
from flask_inputfilter.filters import StringTrimFilter, ToIntegerFilter
from flask_inputfilter.validators import (
    IsIntegerValidator,
    IsStringValidator,
)


class GetPaginatedVideosInputFilter(InputFilter):

    def __init__(self):

        self.add(
            'start',
            required=True,
            filters=[
                ToIntegerFilter()
            ],
            validators=[
                IsIntegerValidator(),
            ],
        )

        self.add(
            'limit',
            required=True,
            filters=[
                ToIntegerFilter()
            ],
            validators=[
                IsIntegerValidator(),
            ],
        )

        # Sorting parameter
        self.add(
            'sort',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        # Filter parameters
        self.add(
            'name_filter',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'category',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'channel_name',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'team_name',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'tournament_name',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        # Date filters
        self.add(
            'recording_date_from',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'recording_date_to',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'upload_date_from',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )

        self.add(
            'upload_date_to',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()],
        )
