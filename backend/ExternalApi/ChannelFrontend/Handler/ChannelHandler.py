import logging

from flask import g

from DataDomain.Database.Model import Channels
from DataDomain.Database.Repository import ChannelRepository
from DataDomain.Model import Response


class CreateChannelHandler:
    """Handler for creating a channel"""

    @staticmethod
    def handle() -> Response:
        """Create Channel"""
        try:
            data = g.validated_data
            logging.info(f"Received channel creation request with data: {data}")

            channel = Channels()
            channel.name = data.get('name')
            channel.link = data.get('link')

            if ChannelRepository.getChannelIdByLink(channel.link):
                logging.warning(f"Channel with link {channel.link} already exists")
                return Response(
                    response='Channel with this link already exists',
                    status=400
                )

            try:
                channel_id = channel.create()
                logging.info(f"Successfully created channel with ID: {channel_id}")
                return Response(
                    response=channel_id,
                    status=200
                )
            except Exception as e:
                logging.error(f"Error creating channel in database: {str(e)}")
                return Response(status=500)

        except Exception as e:
            logging.error(f"Unexpected error in CreateChannelHandler: {str(e)}")
            return Response(status=500)
