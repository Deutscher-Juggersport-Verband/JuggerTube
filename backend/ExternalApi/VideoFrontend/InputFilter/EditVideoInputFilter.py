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


class EditVideoInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'videoId',
            required=True,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'name',
            required=False,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'category',
            required=False,
            filters=[ToNullFilter()],
            validators=[
                InEnumValidator(VideoCategoriesEnum)
            ]
        )

        self.add(
            'videoLink',
            required=False,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'uploadDate',
            required=False,
            filters=[ToDateTimeFilter()],
            validators=[IsDateTimeValidator()]
        )

        self.add(
            'dateOfRecording',
            required=False,
            filters=[ToDateTimeFilter()],
            validators=[IsDateTimeValidator()]
        )

        self.add(
            'comment',
            required=False,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'topic',
            required=False,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'guests',
            required=False,
            filters=[StringTrimFilter(), ToNullFilter()],
            validators=[IsStringValidator()]
        )

        self.add(
            'weaponType',
            required=False,
            filters=[ToNullFilter()],
            validators=[InEnumValidator(WeaponTypesEnum)]
        )

        self.add(
            'gameSystem',
            required=False,
            filters=[ToNullFilter()],
            validators=[InEnumValidator(GameSystemTypesEnum)]
        )

        self.add(
            'channelId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'tournamentId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'teamOneId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )

        self.add(
            'teamTwoId',
            required=False,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )
