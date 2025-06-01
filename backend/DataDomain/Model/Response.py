import json
from typing import Any

from flask import Response as FlaskResponse

from DataDomain.Model import CustomJSONEncoder


class Response(FlaskResponse):
    """Custom Response class that handles JSON serialization"""

    def __init__(self, response: Any = None, error: Any = None, status=200, **kwargs):
        """Custom Response constructor"""

        json_data = json.dumps(response, cls=CustomJSONEncoder)

        if error is not None:
            json_data = json.dumps({'error': error}, cls=CustomJSONEncoder)

        super().__init__(
            response=json_data,
            status=status,
            mimetype='application/json',
            **kwargs)
