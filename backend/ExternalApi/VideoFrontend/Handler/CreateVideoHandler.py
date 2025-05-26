from datetime import datetime
import logging

from DataDomain.Database.Model import Channels
from flask import g

from DataDomain.Database.Enum import VideoCategoriesEnum
from DataDomain.Database.Model import Teams, Tournaments, Videos
from DataDomain.Database.Repository import (
    ChannelRepository,
    TeamRepository,
    TournamentRepository,
    VideoRepository,
)
from DataDomain.Model import Response


class CreateVideoHandler:
    """Handler for creating a video"""

    @staticmethod
    def handle() -> Response:
        """Create Video"""
        try:
            data = g.validated_data
            logging.info(f"Received video creation request with data: {data}")

            try:
                video = CreateVideoHandler._create_base_video(data)
            except ValueError as e:
                logging.error(f"Validation error: {str(e)}")
                return Response(response=str(e), status=400)

            if VideoRepository.getVideoByName(video.name):
                logging.warning(f"Video with name {video.name} already exists")
                return Response(
                    response='Video with this name already exists',
                    status=400
                )

            CreateVideoHandler._handle_category_specific_data(video, data)

            if ((video.category == VideoCategoriesEnum.REPORTS
                 and not video.topic)
                    or (video.category == VideoCategoriesEnum.SPARBUILDING
                        and not video.weapon_type)
                    or (video.category == VideoCategoriesEnum.MATCH
                        and not video.game_system
                        and not video.tournament_id
                        and not video.team_one_id
                        and not video.team_two_id
                        )
                ):
                logging.warning(f"Missing required data for category {video.category}")
                return Response(response='missing required data', status=400)

            try:
                videoId = VideoRepository.create(video)
                logging.info(f"Successfully created video with ID: {videoId}")
                return Response(
                    response=videoId,
                    status=200
                )

            except Exception as e:
                logging.error(f"Error creating video in database: {str(e)}")
                return Response(status=500)

        except Exception as e:
            logging.error(f"Unexpected error in CreateVideoHandler: {str(e)}")
            return Response(status=500)

    @staticmethod
    def _create_base_video(data: dict) -> Videos:
        """Create a video with base properties"""
        video = Videos()
        video.channel_id = CreateVideoHandler._handle_channel_data(data.get('channel'))
        
        if not video.channel_id:
            logging.error(f"Channel not found")
            raise ValueError(f"Channel not found")

        # Set required fields
        video.name = data.get('name')
        video.category = data.get('category')
        video.video_link = data.get('videoLink')

        # Set optional fields
        video.comment = data.get('comment')
        video.upload_date = datetime.fromisoformat(data.get('uploadDate'))
        video.date_of_recording = datetime.fromisoformat(data.get('dateOfRecording')) if data.get('dateOfRecording') else None

        return video

    @staticmethod
    def _handle_category_specific_data(video: Videos, data: dict):
        """Handle category specific data for the video"""
        category = data.get('category')
        
        # Set default empty values for required fields
        video.topic = data.get('topic') or ''
        video.guests = data.get('guests') or ''

        if category == VideoCategoriesEnum.SPARBUILDING:
            video.weapon_type = data.get('weaponType')
            video.topic = data.get('topic') or ''
            video.guests = data.get('guests') or ''

        elif category == VideoCategoriesEnum.HIGHLIGHTS:
            video.tournament_id = CreateVideoHandler._handle_tournament_data(
                data.get('tournament'))
            video.topic = data.get('topic') or ''
            video.guests = data.get('guests') or ''

        elif category in [VideoCategoriesEnum.OTHER, VideoCategoriesEnum.PODCAST]:
            video.topic = data.get('topic') or ''
            video.guests = data.get('guests') or ''

        elif category == VideoCategoriesEnum.TRAINING:
            video.weapon_type = data.get('weaponType')
            video.topic = data.get('topic') or ''

        elif category == VideoCategoriesEnum.REPORTS:
            video.topic = data.get('topic') or ''

        elif category == VideoCategoriesEnum.AWARDS:
            video.tournament_id = CreateVideoHandler._handle_tournament_data(
                data.get('tournament'))
            video.topic = data.get('topic') or ''

        elif category == VideoCategoriesEnum.MATCH:
            video.game_system = data.get('gameSystem')
            video.tournament_id = CreateVideoHandler._handle_tournament_data(
                data.get('tournament'))
            video.team_one_id = CreateVideoHandler._handle_team_data(data.get('teamOne'))
            video.team_two_id = CreateVideoHandler._handle_team_data(data.get('teamTwo'))
            video.topic = data.get('topic') or ''

    @staticmethod
    def _handle_channel_data(channel_data: dict) -> int | None:
        """Handle channel data and return channel ID"""

        if 'id' in channel_data:
            return channel_data.get('id')

        channel = Channels()
        if not ChannelRepository.getChannelIdByName(channel_data.get('name')):
            return None

        channel.name = channel_data.get('name')
        channel.link = channel_data.get('link')
        return ChannelRepository.create(channel)
    
    @staticmethod
    def _handle_tournament_data(tournament_data: dict) -> int | None:
        """Handle tournament data and return tournament ID"""
        if not tournament_data:
            return None

        if 'id' in tournament_data:
            return tournament_data.get('id')

        tournament = Tournaments()

        if TournamentRepository.getTournamentByName(tournament_data.get('name')):
            return None

        tournament.name = tournament_data.get('name')
        tournament.city = tournament_data.get('city')
        tournament.start_date = tournament_data.get('startDate')
        tournament.end_date = tournament_data.get('endDate')
        return TournamentRepository.create(tournament)

    @staticmethod
    def _handle_team_data(team_data: dict) -> int | None:
        """Handle team data and return team ID"""

        if 'id' in team_data:
            return team_data.get('id')

        team = Teams()
        if not TeamRepository.getTeamIdByName(team_data.get('name')):
            return None

        team.name = team_data.get('name')
        team.city = team_data.get('city')
        return TeamRepository.create(team)
