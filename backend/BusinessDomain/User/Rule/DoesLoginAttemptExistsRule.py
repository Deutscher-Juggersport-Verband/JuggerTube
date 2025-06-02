from DataDomain.Database.Model import LoginAttempts


class DoesLoginAttemptExistsRule:

    @staticmethod
    def applies(username: str) -> bool:

        if not username:
            return False

        return LoginAttempts().exists(username=username)
