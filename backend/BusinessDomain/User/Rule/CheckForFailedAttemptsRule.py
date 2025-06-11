from datetime import timedelta

from BusinessDomain.User.Model import LoginAttemptResponse
from BusinessDomain.User.Repository import LoginAttemptRepository
from BusinessDomain.User.Rule.IsUserLockedRule import IsUserLockedRule
from DataDomain.Database.Enum import LockType
from Infrastructure.Logger import logger


class CheckForFailedAttemptsRule:

    @staticmethod
    def applies(username: str) -> LoginAttemptResponse | bool:

        login_attempt = LoginAttemptRepository.getByUsername(username)

        if not login_attempt:
            return False

        is_locked, lock_type = IsUserLockedRule.applies(login_attempt.username)

        if not is_locked:
            return False

        if lock_type == LockType.PERMANENTLY.value:
            logger.warning(f'CheckForFailedAttemptsRule | applies | User {
                username} is permanently locked.')
            return LoginAttemptResponse(
                lockType=lock_type,
                lockedUntil=None
            )

        elif lock_type == LockType.TEMPORARILY.value:
            logger.warning(f'CheckForFailedAttemptsRule | applies | User {
                username} is temporarily locked.')
            return LoginAttemptResponse(
                lockType=lock_type,
                lockedUntil=str(
                    login_attempt.last_attempt +
                    timedelta(minutes=15)
                )
            )

        return False
