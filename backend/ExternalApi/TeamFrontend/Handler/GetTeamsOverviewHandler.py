from DataDomain.Database.Repository import TeamRepository
from DataDomain.Model import Response


class GetTeamsOverviewHandler:
    """Handler for getting teams overview"""

    @staticmethod
    def handle() -> Response:
        teams = TeamRepository.getTeamOverview()

        return Response(
            response=teams,
            status=200,
        ) 