from BusinessDomain.User.Repository import LoginAttemptRepository
from BusinessDomain.User.Rule import (
    DoesLoginAttemptExistsRule,
    IncreaseFailedAttemptsRule,
)


class CreateOrIncreaseLoginAttemptsRule:

    @staticmethod
    def applies(username: str) -> int:

        attemptExists = DoesLoginAttemptExistsRule.applies(username)

        if not attemptExists:
            LoginAttemptRepository.create(username)

            return 1

        return IncreaseFailedAttemptsRule.applies(username)
