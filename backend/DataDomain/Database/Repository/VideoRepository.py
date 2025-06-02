from typing import List

from sqlalchemy.orm import aliased

from DataDomain.Database import db
from DataDomain.Database.Model import Channels, Teams, Tournaments, Videos


class VideoRepository:
    """Repository for video related queries"""

    @staticmethod
    def getVideoOverview() -> List[dict]:
        """Get Video Overview"""

        team_one = aliased(Teams)
        team_two = aliased(Teams)

        videos = (db.session.query(
            Videos.id,
            Videos.name,
            Videos.category,
            Videos.video_link,
            Videos.upload_date,
            Videos.comment,
            Videos.date_of_recording,
            Videos.game_system,
            Videos.weapon_type,
            Videos.topic,
            Videos.guests,
            Channels.name.label('channel_name'),
            Channels.channel_link.label('channel_link'),
            Tournaments.name.label('tournament_name'),
            Tournaments.city.label('tournament_city'),
            Tournaments.start_date.label('tournament_start_date'),
            Tournaments.end_date.label('tournament_end_date'),
            Tournaments.jtr_link.label('tournament_jtr_link'),
            team_one.name.label('team_one_name'),
            team_one.city.label('team_one_city'),
            team_two.name.label('team_two_name'),
            team_two.city.label('team_two_city')
        ).join(
            Channels,
            Videos.channel_id == Channels.id
        ).outerjoin(
            Tournaments,
            Videos.tournament_id == Tournaments.id
        ).outerjoin(
            team_one,
            Videos.team_one_id == team_one.id
        ).outerjoin(
            team_two,
            Videos.team_two_id == team_two.id
        ).filter(
            Videos.is_deleted != True
        ).order_by(
            Videos.upload_date
        ).all())

        result = []
        for video in videos:
            video_dict = {
                'id': video.id,
                'name': video.name,
                'category': video.category.value if video.category else None,
                'videoLink': video.video_link,
                'comment': video.comment,
                'gameSystem': video.game_system.value if video.game_system else None,
                'weaponType': video.weapon_type.value if video.weapon_type else None,
                'topic': video.topic,
                'guests': video.guests,
                'uploadDate': video.upload_date,
                'dateOfRecording': video.date_of_recording,
                'channel': {
                    'name': video.channel_name,
                    'link': video.channel_link,
                },
                'tournament': {
                    'name': video.tournament_name,
                    'city': video.tournament_city,
                    'startDate': video.tournament_start_date,
                    'endDate': video.tournament_end_date,
                    'jtrLink': video.tournament_jtr_link,
                },
                'teamOne': {
                    'name': video.team_one_name,
                    'city': video.team_one_city,
                },
                'teamTwo': {
                    'name': video.team_two_name,
                    'city': video.team_two_city,
                },
            }
            result.append(video_dict)

        return result

    @staticmethod
    def getVideoByName(video_name: str) -> dict | None:
        """get Video by Name"""

        team_one = aliased(Teams)
        team_two = aliased(Teams)

        video = (db.session.query(
            Videos.id,
            Videos.name,
            Videos.category,
            Videos.video_link,
            Videos.upload_date,
            Videos.comment,
            Videos.date_of_recording,
            Videos.game_system,
            Videos.weapon_type,
            Videos.topic,
            Videos.guests,
            Channels.name.label('channel_name'),
            Tournaments.name.label('tournament_name'),
            team_one.name.label('team_one_name'),
            team_two.name.label('team_two_name')
        ).join(
            Channels,
            Videos.channel_id == Channels.id
        ).outerjoin(
            Tournaments,
            Videos.tournament_id == Tournaments.id
        ).outerjoin(
            team_one,
            Videos.team_one_id == team_one.id
        ).outerjoin(
            team_two,
            Videos.team_two_id == team_two.id
        ).filter(
            Videos.is_deleted != True,
            Videos.name == video_name
        ).first())

        if not video:
            return None

        return video

    @staticmethod
    def getPaginatedVideos(start: int, limit: int) -> list:
        team_one = aliased(Teams)
        team_two = aliased(Teams)

        videos = (db.session.query(
            Videos.id,
            Videos.name,
            Videos.category,
            Videos.video_link,
            Videos.upload_date,
            Videos.comment,
            Videos.date_of_recording,
            Videos.game_system,
            Videos.weapon_type,
            Videos.topic,
            Videos.guests,
            Channels.name.label('channel_name'),
            Channels.channel_link.label('channel_link'),
            Tournaments.name.label('tournament_name'),
            Tournaments.city.label('tournament_city'),
            Tournaments.start_date.label('tournament_start_date'),
            Tournaments.end_date.label('tournament_end_date'),
            Tournaments.jtr_link.label('tournament_jtr_link'),
            team_one.name.label('team_one_name'),
            team_one.city.label('team_one_city'),
            team_two.name.label('team_two_name'),
            team_two.city.label('team_two_city')
        ).join(
            Channels,
            Videos.channel_id == Channels.id
        ).outerjoin(
            Tournaments,
            Videos.tournament_id == Tournaments.id
        ).outerjoin(
            team_one,
            Videos.team_one_id == team_one.id
        ).outerjoin(
            team_two,
            Videos.team_two_id == team_two.id
        ).filter(
            Videos.is_deleted != True,
        ).order_by(
            Videos.upload_date
        ).offset(start).limit(limit).all())

        result = []
        for video in videos:
            video_dict = {
                'id': video.id,
                'name': video.name,
                'category': video.category.value if video.category else None,
                'videoLink': video.video_link,
                'comment': video.comment,
                'gameSystem': video.game_system.value if video.game_system else None,
                'weaponType': video.weapon_type.value if video.weapon_type else None,
                'topic': video.topic,
                'guests': video.guests,
                'uploadDate': video.upload_date,
                'dateOfRecording': video.date_of_recording,
                'channel': {
                    'name': video.channel_name,
                    'link': video.channel_link,
                },
                'tournament': {
                    'name': video.tournament_name,
                    'city': video.tournament_city,
                    'startDate': video.tournament_start_date,
                    'endDate': video.tournament_end_date,
                    'jtrLink': video.tournament_jtr_link,
                } if video.tournament_name else None,
                'teamOne': {
                    'name': video.team_one_name,
                    'city': video.team_one_city,
                } if video.team_one_name else None,
                'teamTwo': {
                    'name': video.team_two_name,
                    'city': video.team_two_city,
                } if video.team_two_name else None,
            }
            result.append(video_dict)

        return result
