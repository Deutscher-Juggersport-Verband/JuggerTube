from BusinessDomain.User.Rule.tools import getJwtIdentity
from DataDomain.Database.Enum import UserRoleEnum


class IsCurrentUserAdminRule:

    @staticmethod
    def applies() -> bool:

        user = getJwtIdentity()

        return user and user.role == UserRoleEnum.ADMIN
