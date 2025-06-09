from BusinessDomain.User.Repository import LoginAttemptRepository


class IncreaseFailedAttemptsRule:

    @staticmethod
    def applies(username: str) -> int:

        login_attempt = LoginAttemptRepository.getByUsername(username=username)

        login_attempt.attempts += 1

        login_attempt.save()

        return login_attempt.attempts
