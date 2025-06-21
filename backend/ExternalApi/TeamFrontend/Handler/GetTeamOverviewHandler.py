from DataDomain.Database.Repository import TeamRepository
from DataDomain.Model import Response


class GetTeamOverviewHandler:

    @staticmethod
    def handle() -> Response:

        return Response(
            response=TeamRepository.getTeamOverview(),
            status=200,
        )
