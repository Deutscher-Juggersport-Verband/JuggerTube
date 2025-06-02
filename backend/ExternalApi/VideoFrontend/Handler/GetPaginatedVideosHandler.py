from flask import g

from DataDomain.Database.Model import Videos
from DataDomain.Database.Repository import VideoRepository
from DataDomain.Model import Response


class GetPaginatedVideosHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        start = data.get('start')
        limit = data.get('limit')

        videos = VideoRepository.getPaginatedVideos(
            start=start,
            limit=limit
        )

        return Response(
            response={
                'start': start,
                'limit': limit,
                'count': Videos().count(),
                'results': videos
            },
            status=200,
        )
