from DataDomain.Database.Repository import TournamentRepository
from DataDomain.Model import Response


class GetTournamentOverviewHandler:
    """Handler for getting tournament overview"""

    @staticmethod
    def handle() -> Response:

        return Response(
            response=TournamentRepository.getTournamentOverview(),
            status=200,
        )
