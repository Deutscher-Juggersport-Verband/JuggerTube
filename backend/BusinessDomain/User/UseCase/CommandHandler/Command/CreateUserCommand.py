from dataclasses import dataclass


@dataclass
class CreateUserCommand:

    email: str
    name: str | None
    password: str
    username: str
