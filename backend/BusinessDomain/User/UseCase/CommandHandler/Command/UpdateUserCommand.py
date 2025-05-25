from dataclasses import dataclass


@dataclass
class UpdateUserCommand:

    email: str | None
    name: str | None
    password: str | None
    username: str | None
