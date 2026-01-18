from flask_inputfilter import InputFilter
from flask_inputfilter.filters import (
    StringTrimFilter,
    ToDateTimeFilter,
    ToIntegerFilter,
    ToNullFilter,
)
from flask_inputfilter.validators import (
    InEnumValidator,
    IsDateTimeValidator,
    IsIntegerValidator,
    IsStringValidator,
)

from DataDomain.Database.Enum import (
    GameSystemTypesEnum,
    VideoCategoriesEnum,
    WeaponTypesEnum,
)


class CreateVideoInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'name',
            required=True,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'category',
            required=True,
            filters=[ToNullFilter()],
            validators=[
                InEnumValidator(
                    VideoCategoriesEnum
                )
            ]
        )

        self.add(
            'videoLink',
            required=True,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'uploadDate',
            required=True,
            filters=[
                ToDateTimeFilter()
            ],
            validators=[
                IsDateTimeValidator()
            ],
        )

        self.add(
            'channelId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'channelChannelName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'channelLink',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'comment',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'dateOfRecording',
            required=False,
            filters=[
                ToDateTimeFilter()
            ],
            validators=[
                IsDateTimeValidator()
            ],
        )

        self.add(
            'topic',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'guests',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'weaponType',
            required=False,
            validators=[
                InEnumValidator(WeaponTypesEnum)
            ]
        )

        self.add(
            'gameSystem',
            required=False,
            validators=[
                InEnumValidator(GameSystemTypesEnum)
            ]
        )

        # Tournament object validation
        self.add(
            'tournamentId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'tournamentName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'tournamentCity',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'tournamentStartDate',
            required=False,
            filters=[
                ToDateTimeFilter()
            ],
            validators=[
                IsDateTimeValidator()
            ],
        )

        self.add(
            'tournamentEndDate',
            required=False,
            filters=[
                ToDateTimeFilter()
            ],
            validators=[
                IsDateTimeValidator()
            ],
        )

        # Team One object validation
        self.add(
            'teamOneId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'teamOneTeamName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'teamOneCity',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        # Team Two object validation
        self.add(
            'teamTwoId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'teamTwoTeamName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'teamTwoCity',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )
