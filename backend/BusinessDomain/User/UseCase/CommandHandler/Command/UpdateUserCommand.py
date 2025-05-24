from dataclasses import dataclass


@dataclass
class UpdateUserCommand:

    email: str | None
