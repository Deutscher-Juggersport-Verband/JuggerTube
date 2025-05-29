from dataclasses import dataclass

from DataDomain.Database.Enum import LockType


@dataclass
class LoginUserResult:

    token: str | None = None
    lockType: LockType | None = None
    lockedUntil: str | None = None
