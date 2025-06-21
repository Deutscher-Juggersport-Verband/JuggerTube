from datetime import datetime

from sqlalchemy import func, or_
from sqlalchemy.orm import aliased

from BusinessDomain.User.Model import UserShort
from DataDomain.Database import db
from DataDomain.Database.Enum import VideoCategoriesEnum, VideoStatusEnum
from DataDomain.Database.Model import Channels, Teams, Tournaments, Users, Videos


class VideoRepository:

    @staticmethod
    def getVideoOverview() -> list[dict]:

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
            Videos.status == VideoStatusEnum.APPROVED.value
        ).order_by(
            Videos.upload_date
        ).all())

        return [
            {
                'id': video.id,
                'name': video.name,
                'category': video.category,
                'videoLink': video.video_link,
                'comment': video.comment,
                'gameSystem': video.game_system,
                'weaponType': video.weapon_type,
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
            } for video in videos]

    @staticmethod
    def getVideoByName(video_name: str) -> dict | None:

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
            Videos.name == video_name,
            Videos.status == VideoStatusEnum.APPROVED.value
        ).first())

        if not video:
            return None

        return video

    @staticmethod
    def checkIfVideoAlreadyExists(name: str, link: str) -> bool:
        video = (db.session.query(
            Videos.id,
            Videos.name,
            Videos.video_link,
            Videos.status,
            Videos.is_deleted
        ).filter(
            Videos.is_deleted != True,
            func.lower(Videos.name) == func.lower(name),
            Videos.video_link == link,
            Videos.status != VideoStatusEnum.DECLINED
        ).first())

        return video is not None

    @staticmethod
    def getPaginatedVideos(
        start: int,
        limit: int,
        sort: str = None,
        name_filter: str = None,
        category: str = None,
        channel_name: str = None,
        team_name: str = None,
        tournament_name: str = None,
        recording_date_from: str = None,
        recording_date_to: str = None,
        upload_date_from: str = None,
        upload_date_to: str = None
    ) -> list:
        team_one = aliased(Teams)
        team_two = aliased(Teams)

        query = (db.session.query(
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
            Videos.created_at,
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
            Videos.status == VideoStatusEnum.APPROVED.value
        ))

        # Apply filters
        if name_filter:
            query = query.filter(Videos.name.ilike(f'%{name_filter}%'))

        if category:
            query = query.filter(Videos.category == VideoCategoriesEnum(category))

        if channel_name:
            query = query.filter(Channels.name.ilike(f'%{channel_name}%'))

        if team_name:
            query = query.filter(
                or_(
                    team_one.name.ilike(f'%{team_name}%'),
                    team_two.name.ilike(f'%{team_name}%')
                )
            )

        if tournament_name:
            query = query.filter(Tournaments.name.ilike(f'%{tournament_name}%'))

        if recording_date_from:
            recording_from = datetime.strptime(recording_date_from, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.date_of_recording) >= recording_from)

        if recording_date_to:
            recording_to = datetime.strptime(recording_date_to, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.date_of_recording) <= recording_to)

        if upload_date_from:
            upload_from = datetime.strptime(upload_date_from, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.upload_date) >= upload_from)

        if upload_date_to:
            upload_to = datetime.strptime(upload_date_to, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.upload_date) <= upload_to)

        # Apply sorting
        if sort == 'name_asc':
            query = query.order_by(Videos.name.asc())
        elif sort == 'name_desc':
            query = query.order_by(Videos.name.desc())
        elif sort == 'recording_date_asc':
            query = query.order_by(Videos.date_of_recording.asc())
        elif sort == 'recording_date_desc':
            query = query.order_by(Videos.date_of_recording.desc())
        elif sort == 'upload_date_desc':
            query = query.order_by(Videos.upload_date.desc())
        elif sort == 'created_at_desc':
            query = query.order_by(Videos.created_at.desc())
        else:
            # Default sorting (maintain current behavior)
            query = query.order_by(Videos.upload_date.asc())

        # Convert 1-based start to 0-based offset
        offset = max(0, start - 1)
        videos = query.offset(offset).limit(limit).all()

        return [
            {
                'id': video.id,
                'name': video.name,
                'category': video.category,
                'videoLink': video.video_link,
                'comment': video.comment,
                'gameSystem': video.game_system,
                'weaponType': video.weapon_type,
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
            } for video in videos]

    @staticmethod
    def getFilteredVideoCount(
        name_filter: str = None,
        category: str = None,
        channel_name: str = None,
        team_name: str = None,
        tournament_name: str = None,
        recording_date_from: str = None,
        recording_date_to: str = None,
        upload_date_from: str = None,
        upload_date_to: str = None
    ) -> int:
        team_one = aliased(Teams)
        team_two = aliased(Teams)

        query = (db.session.query(Videos.id).join(
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
            Videos.status == VideoStatusEnum.APPROVED.value
        ))

        # Apply the same filters as in getPaginatedVideos
        if name_filter:
            query = query.filter(Videos.name.ilike(f'%{name_filter}%'))

        if category:
            query = query.filter(Videos.category == VideoCategoriesEnum(category))

        if channel_name:
            query = query.filter(Channels.name.ilike(f'%{channel_name}%'))

        if team_name:
            query = query.filter(
                or_(
                    team_one.name.ilike(f'%{team_name}%'),
                    team_two.name.ilike(f'%{team_name}%')
                )
            )

        if tournament_name:
            query = query.filter(Tournaments.name.ilike(f'%{tournament_name}%'))

        if recording_date_from:
            recording_from = datetime.strptime(recording_date_from, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.date_of_recording) >= recording_from)

        if recording_date_to:
            recording_to = datetime.strptime(recording_date_to, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.date_of_recording) <= recording_to)

        if upload_date_from:
            upload_from = datetime.strptime(upload_date_from, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.upload_date) >= upload_from)

        if upload_date_to:
            upload_to = datetime.strptime(upload_date_to, '%Y-%m-%d').date()
            query = query.filter(func.date(Videos.upload_date) <= upload_to)

        return query.count()

    @staticmethod
    def getPendingVideoOverview() -> list:
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
            team_two.city.label('team_two_city'),
            Users.id.label('user_id'),
            Users.name.label('user_name'),
            Users.username.label('user_username'),
            Users.escaped_username.label('user_escapedUsername'),
            Users.picture_url.label('user_pictureUrl'),
            Users.role.label('user_role')
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
        ).join(
            Users,
            Videos.uploader_id == Users.id
        ).filter(
            Videos.is_deleted != True,
            Videos.status == VideoStatusEnum.PENDING.value
        ).order_by(
            Videos.upload_date
        ).all())

        return [
            {
                'id': video.id,
                'name': video.name,
                'category': video.category,
                'videoLink': video.video_link,
                'comment': video.comment,
                'gameSystem': video.game_system,
                'weaponType': video.weapon_type,
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
                'user': UserShort(
                    id=video.user_id,
                    name=video.user_name,
                    username=video.user_username,
                    pictureUrl=video.user_pictureUrl,
                    escapedUsername=video.user_escapedUsername,
                    role=video.user_role
                ),
            } for video in videos]
