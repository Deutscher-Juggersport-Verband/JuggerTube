from dataclasses import dataclass


@dataclass
class DeleteUserCommand:

    user_id: int
