from DataDomain.Database import db
from DataDomain.Database.Model import LoginAttempts
from Infrastructure.Logger import logger


class LoginAttemptRepository:

    @staticmethod
    def exists(username: str) -> bool:
        return LoginAttempts.query.filter_by(
            username=username).first()

    @staticmethod
    def update() -> None:
        try:
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            logger.error(
                f'LoginAttemptRepository | update | {e}')
            raise e

    @staticmethod
    def create(username: str) -> LoginAttempts:
        try:
            loginAttempt = LoginAttempts()

            loginAttempt.username = username

            db.session.add(loginAttempt)
            db.session.commit()

            logger.info(
                f'LoginAttemptRepository | create | Created new failed login attempt for user {username}')

            return loginAttempt

        except Exception as e:
            db.session.rollback()
            logger.error(f'LoginAttemptRepository | create | {e}')
            raise e

    @staticmethod
    def getByUsername(username: str) -> LoginAttempts | None:
        return LoginAttempts.query.filter_by(username=username).first()
