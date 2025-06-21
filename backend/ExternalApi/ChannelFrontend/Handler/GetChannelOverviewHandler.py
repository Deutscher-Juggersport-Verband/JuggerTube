from DataDomain.Database.Repository import ChannelRepository
from DataDomain.Model import Response


class GetChannelOverviewHandler:

    @staticmethod
    def handle() -> Response:

        return Response(
            response=ChannelRepository.getChannelOverview(),
            status=200,
        )
