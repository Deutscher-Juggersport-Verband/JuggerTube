from datetime import datetime

from flask import g

from DataDomain.Database.Enum import GameSystemTypesEnum, VideoCategoriesEnum
from DataDomain.Database.Model import Videos
from DataDomain.Database.Repository import (
    ChannelRepository,
    TeamRepository,
    TournamentRepository,
    VideoRepository,
)
from DataDomain.Model import Response
from ExternalApi.VideoFrontend.config import clear_video_overview_cache


class CreateMultipleVideosHandler:
    """Handler for creating multiple videos"""

    @staticmethod
    def handle() -> Response:
        """Create Video"""
        data = g.validated_data
        videos_data = data.get('videos', [])

        if not videos_data:
            return Response(
                response='No videos provided',
                status=400
            )

        created_videos: list[dict] = []
        failed_videos: list[dict] = []

        for video_data in videos_data:
            video_name = video_data.get('name')
            video_url = video_data.get('videoLink')

            if VideoRepository.videoAlreadyExists(video_name, video_url):
                continue

            channel_name = video_data.get('channelName')

            if not channel_name:
                failed_videos.append({
                    'name': video_name,
                    'reason': 'Channel name is required'
                })
                continue

            channel_id = ChannelRepository.getChannelIdByName(channel_name=channel_name)

            if not channel_id:
                failed_videos.append({
                    'name': video_name,
                    'reason': f'Channel does not exist: {channel_name}'
                })
                continue

            # Set required fields
            video = Videos(
                name=video_name,
                category=video_data.get('category'),
                video_link=video_data.get('videoLink'),
                channel_id=channel_id,
                topic='',
                guests='',
            )

            # Handle category-specific fields
            if video.category == VideoCategoriesEnum.MATCH:
                video.game_system = GameSystemTypesEnum.SETS

                # Validate tournament for match videos
                tournament_name = video_data.get('tournamentName')
                if not tournament_name:
                    failed_videos.append({
                        'name': video.name,
                        'reason': 'Tournament name is required for match videos'
                    })
                    continue

                tournament_id = TournamentRepository.getTournamentByName(tournament_name)
                if tournament_id is None:
                    failed_videos.append({
                        'name': video.name,
                        'reason': f'Tournament not found: {tournament_name}'
                    })
                    continue
                video.tournament_id = tournament_id

                # Validate teams for match videos
                team_one_name = video_data.get('teamOneName')
                team_two_name = video_data.get('teamTwoName')

                if not team_one_name or not team_two_name:
                    failed_videos.append({
                        'name': video.name,
                        'reason': 'Both team names are required for match videos'
                    })
                    continue

                team_one_id = TeamRepository.getTeamIdByName(team_name=team_one_name)
                team_two_id = TeamRepository.getTeamIdByName(team_name=team_two_name)

                if team_one_id is None:
                    failed_videos.append({
                        'name': video.name,
                        'reason': f'Team not found: {team_one_name}'
                    })
                    continue

                if team_two_id is None:
                    failed_videos.append({
                        'name': video.name,
                        'reason': f'Team not found: {team_two_name}'
                    })
                    continue

                video.team_one_id = team_one_id
                video.team_two_id = team_two_id

            elif video.category in [VideoCategoriesEnum.HIGHLIGHTS, VideoCategoriesEnum.AWARDS]:
                tournament_name = video_data.get('tournamentName')
                if tournament_name:
                    tournament_id = TournamentRepository.getTournamentByName(
                        tournament_name)
                    if tournament_id is None:
                        failed_videos.append({
                            'name': video.name,
                            'reason': f'Tournament not found: {tournament_name}'
                        })
                        continue
                    video.tournament_id = tournament_id

            elif video.category == VideoCategoriesEnum.REPORTS:
                video.topic = video_data.get('topic', '')

            # Set optional fields
            video.comment = video_data.get('comment', '')
            video.upload_date = datetime.fromisoformat(video_data.get('uploadDate'))

            try:
                video_id = video.create()
                created_videos.append({
                    'name': video.name,
                    'id': video_id
                })
            except Exception as e:
                failed_videos.append({
                    'name': video.name,
                    'reason': str(e)
                })

        clear_video_overview_cache()

        return Response(
            response={
                'created_videos': created_videos,
                'failed_videos': failed_videos
            },
            status=200 if created_videos else 400
        )
