import json
from dataclasses import asdict, is_dataclass
from datetime import date, datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import Row
from sqlalchemy.exc import OperationalError


class CustomJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles serialization of datetime and Decimal objects and converts dict keys to camelCase"""

    def encode(self, obj):
        def convert(obj):
            if is_dataclass(obj):
                obj = asdict(obj)

            if isinstance(obj, dict):
                return {
                    self._snake_to_camel(k) if isinstance(
                        k,
                        str) else k: convert(v) for k,
                    v in obj.items()}

            elif isinstance(obj, list):

                return [convert(i) for i in obj]
            elif isinstance(obj, Row):

                return convert(dict(obj._mapping))
            elif isinstance(obj, Enum):
                return obj.value

            elif isinstance(obj, (datetime, date)):
                return obj.isoformat()

            elif isinstance(obj, Decimal):
                return float(obj)

            elif isinstance(obj, OperationalError):
                return str(obj)

            return obj
        return super().encode(convert(obj))

    @staticmethod
    def _snake_to_camel(s):
        parts = s.split('_')
        return parts[0] + ''.join(word.capitalize()
                                  for word in parts[1:]) if '_' in s else s

    def default(self, obj):
        if is_dataclass(obj):
            return asdict(obj)

        elif obj is None:
            return {}
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()

        elif isinstance(obj, Decimal):
            return float(obj)

        elif isinstance(obj, OperationalError):
            return str(obj)

        elif isinstance(obj, Row):
            return dict(obj._mapping)

        elif isinstance(obj, Enum):
            return obj.value if obj else None

        return super().default(obj)
