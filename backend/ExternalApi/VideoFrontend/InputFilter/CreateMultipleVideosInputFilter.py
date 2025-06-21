from flask_inputfilter import InputFilter
from flask_inputfilter.filters import ToDateTimeFilter
from flask_inputfilter.validators import (
    ArrayElementValidator,
    ArrayLengthValidator,
    InEnumValidator,
    IsArrayValidator,
    IsDateTimeValidator,
    IsStringValidator,
)

from DataDomain.Database.Enum import VideoCategoriesEnum


class CreateMultipleVideosVideoElementInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'name',
            required=True,
            validators=[
                IsStringValidator()
            ],
        )

        self.add(
            'channelName',
            required=True,
            validators=[
                IsStringValidator()
            ],
        )

        self.add(
            'category',
            required=True,
            validators=[
                InEnumValidator(VideoCategoriesEnum)
            ],
        )

        self.add(
            'videoLink',
            required=True,
            validators=[
                IsStringValidator()
            ],
        )

        self.add(
            'uploadDate',
            required=True,
            validators=[
                IsStringValidator()
            ],
        )


class CreateMultipleVideosInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'videos',
            required=True,
            validators=[
                IsArrayValidator(),
                ArrayLengthValidator(min_length=1),
                ArrayElementValidator(
                    element_filter=CreateMultipleVideosVideoElementInputFilter()
                )
            ],
        )
