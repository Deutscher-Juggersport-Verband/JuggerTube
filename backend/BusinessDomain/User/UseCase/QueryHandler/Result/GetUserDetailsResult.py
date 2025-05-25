from dataclasses import dataclass
from datetime import datetime

from DataDomain.Database.Enum import UserRoleEnum


@dataclass
class GetUserDetailsResult:

    id: int
    createdAt: datetime
    email: str
    name: str
    pictureUrl: str
    role: UserRoleEnum
    username: str
    escaped_username: str
