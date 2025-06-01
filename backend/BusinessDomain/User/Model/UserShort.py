from dataclasses import dataclass

from DataDomain.Database.Enum import UserRoleEnum


@dataclass
class UserShort:

    id: int
    escapedUsername: str
    name: str
    pictureUrl: str
    role: UserRoleEnum
    username: str
