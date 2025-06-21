
from DataDomain.Database import db
from DataDomain.Database.Model import Channels


class ChannelRepository:
    """Repository for channel related queries"""

    @staticmethod
    def getChannelOverview() -> list[dict]:
        """Get Channel Overview"""

        return db.session.query(
            Channels.id,
            Channels.name,
            Channels.channel_link
        ).filter(
            Channels.is_deleted != True
        ).order_by(
            Channels.name.asc()
        ).all()

    @staticmethod
    def getChannelById(channel_id: int) -> dict | None:
        """Get Channel by id"""

        return db.session.query(
            Channels.id,
            Channels.name,
            Channels.channel_link
        ).filter(
            Channels.id == channel_id
        ).group_by(
            Channels.id
        ).first()

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
