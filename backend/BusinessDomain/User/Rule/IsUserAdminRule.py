from DataDomain.Database import db
from DataDomain.Database.Enum import UserRoleEnum
from DataDomain.Database.Model import Users


class IsUserAdminRule:

    @staticmethod
    def applies(escaped_username: str) -> bool:

        user = db.session.query(
            Users.role).filter(
            Users.escaped_username == escaped_username,
            Users.is_deleted == False).scalar()

        return user and user.role == UserRoleEnum.ADMIN
