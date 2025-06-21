from flask import g

from config import cache
from DataDomain.Database.Model import Channels
from DataDomain.Database.Repository import ChannelRepository
from DataDomain.Model import Response


class CreateMultipleChannelsHandler:

    @staticmethod
    def handle() -> Response:
        try:
            data = g.validated_data
            channels_data = data.get('channels')

            if not channels_data:
                return Response(
                    response={'error': 'No channels data provided'},
                    status=400
                )

            created_channels: list[dict] = []
            failed_channels: list[dict] = []
            existing_channels: list[dict] = []

            for i, channel_data in enumerate(channels_data):
                try:
                    channel = Channels(
                        name=channel_data.get('name'),
                        channel_link=channel_data.get('channelLink'),
                    )

                    if ChannelRepository.checkIfChannelNameAlreadyExists(channel.name) or ChannelRepository.checkIfChannelLinkAlreadyExists(channel.channel_link):
                        existing_channels.append({
                            'name': channel.name
                        })
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
                'failed_channels': failed_channels,
                'existing_channels': existing_channels
            }

            if failed_channels:
                return Response(
                    response=response_data,
                    status=400
                )

            if not created_channels and not existing_channels:
                return Response(
                    response=response_data,
                    status=400
                )

            cache.delete('channel-overview')

            if created_channels and existing_channels:
                return Response(
                    response=response_data,
                    status=207
                )

            if existing_channels and not created_channels:
                return Response(
                    response=response_data,
                    status=200
                )

            return Response(
                response=response_data,
                status=200
            )

        except Exception as e:
            return Response(
                response={'error': f'Internal server error: {str(e)}'},
                status=500
            )