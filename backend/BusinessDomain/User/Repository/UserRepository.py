from sqlalchemy import or_

from BusinessDomain.User.Model import UserShort
from DataDomain.Database import db
from DataDomain.Database.Enum import UserRoleEnum
from DataDomain.Database.Model import Users


class UserRepository:

    @staticmethod
    def getByEmail(email: str) -> Users:
        return Users.query.filter_by(
            email=email,
            is_deleted=False
        ).first()

    @staticmethod
    def all() -> list[Users]:
        """Get user overview"""

        return Users.query.filter_by(is_deleted=False).all()

    @staticmethod
    def usernameExists(username: str) -> bool:
        return Users.query.filter_by(username=username).count() > 0

    @staticmethod
    def emailExists(email: str) -> bool:
        return Users.query.filter_by(email=email).count() > 0

    @staticmethod
    def getUserByUsername(username: str) -> Users | None:
        """Get a user by username"""

        return Users.query.filter_by(username=username).first()

    @staticmethod
    def getUserByEscapedUsername(escaped_username: str) -> Users | None:
        """Get a user by escaped username"""

        return Users.query.filter_by(escaped_username=escaped_username).first()

    @staticmethod
    def getUserByEmail(email: str) -> Users | None:
        """Get a user by email"""

        return Users.query.filter_by(email=email).first()

    @staticmethod
    def getUserByUsernameOrEmail(
            username: str | None,
            email: str | None) -> Users | None:
        """Get a user by username or email"""

        return Users.query.filter(
            or_(
                Users.username == username,
                Users.email == email
            ),
            Users.is_deleted == False
        ).first()

    @staticmethod
    def getUserByPasswordResetHash(hash: str) -> Users | None:
        """Get user by password reset hash"""

        return Users.query.filter_by(
            password_reset_hash=hash,
            is_deleted=False
        ).first()

    @staticmethod
    def getUserShortOverview() -> list[UserShort]:

        return db.session.query(
            Users.id,
            Users.escaped_username,
            Users.name,
            Users.picture_url,
            Users.role,
            Users.username
        ).filter(
            Users.is_deleted == False
        ).all()

    @staticmethod
    def getPrivilegedUserShortOverview() -> list[UserShort]:

        return db.session.query(
            Users.id,
            Users.escaped_username,
            Users.name,
            Users.picture_url,
            Users.role,
            Users.username
        ).filter(
            or_(
                Users.role == UserRoleEnum.MODERATOR,
                Users.role == UserRoleEnum.ADMIN,
            ),
            Users.is_deleted == False
        ).all()
