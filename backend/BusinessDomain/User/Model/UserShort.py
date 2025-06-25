from dataclasses import dataclass

from DataDomain.Database.Enum import UserRoleEnum


@dataclass
class UserShort:

    id: int
    escaped_username: str
    name: str
    picture_url: str
    role: UserRoleEnum
    username: str
