from datetime import datetime


class ParseIsoDateRule:

    @staticmethod
    def applies(date_str: str) -> datetime | None:

        return datetime.fromisoformat(date_str) if date_str else None
