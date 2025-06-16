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
            'channel.id',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'channel.channelName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'channel.link',
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
            'tournament.id',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'tournament.name',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'tournament.city',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'tournament.startDate',
            required=False,
            filters=[
                ToDateTimeFilter()
            ],
            validators=[
                IsDateTimeValidator()
            ],
        )

        self.add(
            'tournament.endDate',
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
            'teamOne.id',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'teamOne.teamName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'teamOne.city',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        # Team Two object validation
        self.add(
            'teamTwo.id',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'teamTwo.teamName',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'teamTwo.city',
            required=False,
            filters=[StringTrimFilter()],
            validators=[IsStringValidator()]
        )
