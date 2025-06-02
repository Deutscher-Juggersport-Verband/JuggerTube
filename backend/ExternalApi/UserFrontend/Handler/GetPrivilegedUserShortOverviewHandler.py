
from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.Rule import IsCurrentUserAdminRule
from DataDomain.Model import Response


class GetPrivilegedUserShortOverviewHandler:

    @staticmethod
    def handle() -> Response:

        if not IsCurrentUserAdminRule.applies():
            return Response(403)

        return Response(
            response=UserRepository.getPrivilegedUserShortOverview(),
            status=200,
        )
