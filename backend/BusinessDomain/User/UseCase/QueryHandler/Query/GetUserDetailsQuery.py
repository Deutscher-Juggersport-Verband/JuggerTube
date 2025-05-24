from dataclasses import dataclass


@dataclass
class GetUserDetailsQuery:

    escaped_username: str | None
