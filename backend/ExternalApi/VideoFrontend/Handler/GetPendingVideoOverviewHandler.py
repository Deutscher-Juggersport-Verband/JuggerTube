from BusinessDomain.User.Rule import IsCurrentUserPrivilegedRule
from DataDomain.Database.Repository import VideoRepository
from DataDomain.Model import Response


class GetPendingVideoOverviewHandler:

    @staticmethod
    def handle() -> Response:
        if not IsCurrentUserPrivilegedRule.applies():
            return Response(status=403)

        return Response(
            response=VideoRepository.getPendingVideoOverview(),
            status=200,
        )
