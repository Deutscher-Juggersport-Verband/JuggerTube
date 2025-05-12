from flask import request
from DataDomain.Database.Repository import VideoRepository
from DataDomain.Model import Response


class GetPaginatedVideosHandler:
    """Handler for getting paginated videos"""

    @staticmethod
    def handle() -> Response:

        url = '/api/video-frontend/get-paginated-videos'

        videos = VideoRepository.getVideoOverview()

        start = int(request.args.get('start'))
        limit = int(request.args.get('limit'))
        count = len(videos)

        if count < start or limit < -1:
            return Response(
                response="No videos at this index or limit must be higher then 0",
                status=404
            )

        # make response
        response = {'start': start, 'limit': limit, 'count': count, 'results': videos[start:(start + limit)]}

        return Response(
            response=response,
            status=200,
        )
