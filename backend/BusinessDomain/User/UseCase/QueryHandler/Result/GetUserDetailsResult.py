from dataclasses import dataclass
from datetime import datetime


@dataclass
class GetUserDetailsResult:

    id: int
    createdAt: datetime
    email: str
    isDeleted: bool
    name: str
    pictureUrl: str
    updatedAt: datetime
    username: str
