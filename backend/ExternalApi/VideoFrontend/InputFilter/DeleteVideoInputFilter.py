from flask_inputfilter import InputFilter
from flask_inputfilter.filters import ToIntegerFilter
from flask_inputfilter.validators import IsIntegerValidator


class DeleteVideoInputFilter(InputFilter):

    def __init__(self) -> None:

        self.add(
            'videoId',
            required=True,
            filters=[ToIntegerFilter()],
            validators=[IsIntegerValidator()]
        )
