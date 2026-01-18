import logging

from amqp import channel
from flask import g
from flask_jwt_extended import get_jwt_identity

from BusinessDomain.User.Rule import IsCurrentUserPrivilegedRule
from BusinessDomain.User.Rule.tools import getJwtIdentity
from DataDomain.Database.Enum import VideoCategoriesEnum, VideoStatusEnum
from DataDomain.Database.Model import Channels, Teams, Tournaments, Videos
from DataDomain.Database.Repository import (
    ChannelRepository,
    TeamRepository,
    TournamentRepository,
    VideoRepository,
)
from DataDomain.Model import Response
from ExternalApi.VideoFrontend.config import clear_video_overview_cache
from flask import current_app


class CreateVideoHandler:
    """Handler for creating a video"""

    @staticmethod
    def handle() -> Response:
        """Create Video"""
        try:
            data = g.validated_data

            current_app.logger.info(f"data: {data}")
            logging.info(
                f"CreateVideo | Received video creation request with data: {data}")

            current_app.logger.info("here2")
            video = CreateVideoHandler._create_base_video(data)

            current_app.logger.info("here3")
            if VideoRepository.checkIfVideoNameAlreadyExistsk(
                    video.name) or VideoRepository.checkIfVideoLinkAlreadyExists(
                    video.video_link):
                return Response(
                    response='Video with this name already exists',
                    status=400
                )

            current_app.logger.info("here4")
            CreateVideoHandler._handle_category_specific_data(video, data)

            current_app.logger.info("here5")
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

            current_app.logger.info("here6")
            video_id = video.create()
            logging.info(f"Successfully created video with ID: {video_id}")

            current_app.logger.info("here7")
            clear_video_overview_cache()

            current_app.logger.info("here8")
            return Response(
                response=video_id,
                status=200
            )

        except Exception as e:
            logging.error(f"Unexpected error in CreateVideoHandler: {str(e)}")
            return Response(status=500)

    @staticmethod
    def _create_base_video(data: dict) -> Videos:
        """Create a video with base properties"""
        current_app.logger.info("test")
        video = Videos()
        current_app.logger.info("test0")
        video.channel_id = data.get('channelId')
        current_app.logger.info(f"channelId: {video.channel_id}")

        current_app.logger.info("test1")
        if not video.channel_id:
            logging.error(f"Channel not found: {channel}")
            raise ValueError("Channel not found")

        current_app.logger.info("test2")
        # Set required fields
        video.name = data.get('name')
        video.category = data.get('category')
        video.video_link = data.get('videoLink')

        current_app.logger.info("test3")
        # Set optional fields
        video.comment = data.get('comment')
        video.upload_date = data.get('uploadDate')
        video.date_of_recording = data.get('dateOfRecording')

        current_app.logger.info("test4")
        # TODO: Remove after migrating to flask commands
        if not get_jwt_identity():
            video.status = VideoStatusEnum.APPROVED

            return video

        current_app.logger.info("test5")
        if IsCurrentUserPrivilegedRule():
            video.status = VideoStatusEnum.APPROVED
            video.uploader_id = getJwtIdentity().id

            return video

        current_app.logger.info("test6")
        video.status = VideoStatusEnum.PENDING
        current_app.logger.info("test7")

        return video

    @staticmethod
    def _handle_category_specific_data(video: Videos, data: dict):
        """Handle category specific data for the video"""
        category = data.get('category')

        # Set default empty values for required fields
        video.topic = data.get('topic') or ''
        video.guests = data.get('guests') or ''

        if category == VideoCategoriesEnum.SPARBUILDING or category == VideoCategoriesEnum.TRAINING:
            video.weapon_type = data.get('weaponType')

        elif category == VideoCategoriesEnum.HIGHLIGHTS or category == VideoCategoriesEnum.AWARDS:
            video.tournament_id = CreateVideoHandler._handle_tournament_data(
                data.get('tournament'))

        elif category == VideoCategoriesEnum.MATCH:
            video.game_system = data.get('gameSystem')
            video.tournament_id = CreateVideoHandler._handle_tournament_data(
                data.get('tournament'))
            video.team_one_id = CreateVideoHandler._handle_team_data(data.get('teamOne'))
            video.team_two_id = CreateVideoHandler._handle_team_data(data.get('teamTwo'))

    @staticmethod
    def _handle_channel_data(channel_data: dict) -> int | None:
        """Handle channel data and return channel ID"""

        current_app.logger.info(f"channelData: {channel_data}")
        if 'id' in channel_data:
            return channel_data.get('id')

        current_app.logger.info("channel1")
        channel = Channels()
        if not ChannelRepository.getChannelIdByName(channel_data.get('name')):
            return None

        current_app.logger.info("channel2")
        channel.name = channel_data.get('name')
        channel.link = channel_data.get('link')
        current_app.logger.info("channel3")
        return channel.create()

    @staticmethod
    def _handle_tournament_data(tournament_data: dict) -> int | None:
        """Handle tournament data and return tournament ID"""
        if not tournament_data:
            return None

        if 'id' in tournament_data:
            return tournament_data.get('id')

        if TournamentRepository.getTournamentByName(tournament_data.get('name')):
            return None

        tournament = Tournaments()

        tournament.name = tournament_data.get('name')
        tournament.city = tournament_data.get('city')
        tournament.start_date = tournament_data.get('startDate')
        tournament.end_date = tournament_data.get('endDate')
        return tournament.create()

    @staticmethod
    def _handle_team_data(team_data: dict) -> int | None:
        """Handle team data and return team ID"""

        if 'id' in team_data:
            return team_data.get('id')

        team = Teams()
        if not TeamRepository.getTeamIdByName(team_name=team_data.get('name')):
            return None

        team.name = team_data.get('name')
        team.city = team_data.get('city')
        return team.create()
