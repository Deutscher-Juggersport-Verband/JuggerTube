import logging

from flask import g

from DataDomain.Database.Model import Channels
from DataDomain.Database.Repository import ChannelRepository
from DataDomain.Model import Response


class CreateChannelHandler:

    @staticmethod
    def handle() -> Response:

        try:
            data = g.validated_data
            logging.info(f"Received channel creation request with data: {data}")

            channel = Channels(
                name=data.get('name'),
                link=data.get('link')
            )

            if ChannelRepository.checkIfChannelNameAlreadyExists(channel.name) or ChannelRepository.checkIfChannelLinkAlreadyExists(channel.link):
                return Response(
                    response='Channel with this name or link already exists',
                    status=400
                )

            channel_id = channel.create()
            logging.info(f"Successfully created channel with ID: {channel_id}")

            return Response(
                response=channel_id,
                status=200
            )

        except Exception as e:
            logging.error(f"Unexpected error in CreateChannelHandler: {str(e)}")
            return Response(status=500)
