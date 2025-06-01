from DataDomain.Database.Model import LoginAttempts


class LoginAttemptRepository:

    @staticmethod
    def exists(username: str) -> bool:
        return LoginAttempts.query.filter_by(
            username=username).first()

    @staticmethod
    def getByUsername(username: str) -> LoginAttempts | None:
        return LoginAttempts.query.filter_by(username=username).first()
