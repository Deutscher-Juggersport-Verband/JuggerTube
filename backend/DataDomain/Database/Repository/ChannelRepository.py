from typing import List

from DataDomain.Database import db
from DataDomain.Database.Model import Channels
from sqlalchemy import func


class ChannelRepository:
    """Repository for channel related queries"""

    @staticmethod
    def getChannelOverview() -> List[dict]:
        """Get Channel Overview"""

        channels = (db.session.query(
            Channels.id,
            Channels.name,
            Channels.channel_link
        ).filter(
            Channels.is_deleted != True
        ).order_by(
            Channels.name.asc()
        ).all())

        result = []
        for channel in channels:
            channel_dict = {
                'id': channel.id,
                'name': channel.name,
                'channelLink': channel.channel_link,
            }
            result.append(channel_dict)

        return result

    @staticmethod
    def getChannelById(channel_id: int) -> dict | None:
        """Get Channel by id"""

        channel = db.session.query(
            Channels.id,
            Channels.name,
            Channels.channel_link
        ).filter(
            Channels.id == channel_id
        ).group_by(
            Channels.id
        ).first()

        if not channel:
            return None

        return {
            'id': channel.id,
            'name': channel.name,
            'channelLink': channel.channel_link
        }

    @staticmethod
    def getChannelIdByLink(channel_link: str) -> int | None:
        """Get Channel by id"""

        channel = db.session.query(
            Channels.id,
            Channels.channel_link
        ).filter(
            Channels.channel_link == channel_link
        ).group_by(
            Channels.id
        ).first()

        if not channel:
            return None

        return channel.id

    @staticmethod
    def getChannelIdByName(channel_name: str) -> int | None:
        """Get Channel by name"""

        channel = db.session.query(
            Channels.id,
            Channels.channel_link,
            Channels.name
        ).filter(
            Channels.name == channel_name
        ).group_by(
            Channels.id
        ).first()

        if not channel:
            return None

        return channel.id

    @staticmethod
    def checkIfChannelAlreadyExists(channel_name: str, channel_link: str) -> bool:
        channel = (db.session.query(
            Channels.id,
            Channels.name,
            Channels.channel_link,
        ).filter(
            Channels.is_deleted != True,
            func.lower(Channels.name) == func.lower(channel_name),
            Channels.channel_link == channel_link
        ).first())

        return channel is not None
