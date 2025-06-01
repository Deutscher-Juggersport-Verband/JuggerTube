from typing import Dict, List

from flask import g

from DataDomain.Database.Model import Channels
from DataDomain.Database.Repository import ChannelRepository
from DataDomain.Model import Response


class CreateMultipleChannelsHandler:
    """Handler for creating multiple channels"""

    @staticmethod
    def handle() -> Response:

        data = g.validated_data
        channels_data = data.get('channels')

        created_channels: List[Dict] = []
        failed_channels: List[Dict] = []

        for channel_data in channels_data:
            try:
                channel = Channels(
                    name=channel_data.get('name'),
                    channel_link=channel_data.get('channelLink'),
                )

                # Check if channel already exists
                if ChannelRepository.getChannelIdByName(channel.name):
                    continue

                channel_id = channel.create()
                created_channels.append({
                    'name': channel.name,
                    'id': channel_id
                })
            except Exception as e:
                failed_channels.append({
                    'name': channel_data.get('name', 'Unknown'),
                    'reason': str(e)
                })

        response_data = {
            'created_channels': created_channels,
            'failed_channels': failed_channels
        }

        # If no channels were created successfully, return 400
        if not created_channels:
            return Response(
                response=response_data,
                status=400
            )

        # If some channels failed but others succeeded, return 207 (Multi-Status)
        if failed_channels:
            return Response(
                response=response_data,
                status=207
            )

        # If all channels were created successfully, return 200
        return Response(
            response=response_data,
            status=200
        )
