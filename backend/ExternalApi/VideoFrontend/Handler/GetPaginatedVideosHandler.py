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
        
        # Sorting parameter
        sort = data.get('sort')
        
        # Filter parameters
        name_filter = data.get('name_filter')
        category = data.get('category')
        channel_name = data.get('channel_name')
        team_name = data.get('team_name')
        tournament_name = data.get('tournament_name')
        recording_date_from = data.get('recording_date_from')
        recording_date_to = data.get('recording_date_to')
        upload_date_from = data.get('upload_date_from')
        upload_date_to = data.get('upload_date_to')

        videos = VideoRepository.getPaginatedVideos(
            start=start,
            limit=limit,
            sort=sort,
            name_filter=name_filter,
            category=category,
            channel_name=channel_name,
            team_name=team_name,
            tournament_name=tournament_name,
            recording_date_from=recording_date_from,
            recording_date_to=recording_date_to,
            upload_date_from=upload_date_from,
            upload_date_to=upload_date_to
        )

        # Get filtered count
        count = VideoRepository.getFilteredVideoCount(
            name_filter=name_filter,
            category=category,
            channel_name=channel_name,
            team_name=team_name,
            tournament_name=tournament_name,
            recording_date_from=recording_date_from,
            recording_date_to=recording_date_to,
            upload_date_from=upload_date_from,
            upload_date_to=upload_date_to
        )

        return Response(
            response={
                'start': start,
                'limit': limit,
                'count': count,
                'results': videos
            },
            status=200,
        )
