from .DoesLoginAttemptExistsRule import DoesLoginAttemptExistsRule
from .IncreaseFailedAttemptsRule import IncreaseFailedAttemptsRule
from DataDomain.Database.Model import LoginAttempts


class CreateOrIncreaseLoginAttemptsRule:

    @staticmethod
    def applies(username: str) -> int:

        attempt_exists = DoesLoginAttemptExistsRule.applies(username)

        if not attempt_exists:
            login_attempt = LoginAttempts()

            login_attempt.username = username

            login_attempt.create()

            return 1

        return IncreaseFailedAttemptsRule.applies(username)
