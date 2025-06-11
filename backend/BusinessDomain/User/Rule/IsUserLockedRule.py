from datetime import datetime, timedelta

from BusinessDomain.User.Repository import LoginAttemptRepository
from DataDomain.Database.Enum import LockType


class IsUserLockedRule:

    @staticmethod
    def applies(username: str) -> tuple[bool, LockType | None, datetime | None]:

        login_attempt = LoginAttemptRepository.getByUsername(username)

        if not login_attempt:
            return False, None, None

        lock_time = timedelta(minutes=15)

        if login_attempt.attempts >= 8:
            return True, LockType.PERMANENTLY.value, None

        elif login_attempt.attempts >= 6 and datetime.now() - login_attempt.last_attempt < lock_time:
            return True, LockType.TEMPORARILY.value, login_attempt.locked_until

        return False, None, None
