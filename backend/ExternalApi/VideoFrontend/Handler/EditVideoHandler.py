import logging

from flask import g

from DataDomain.Database.Model import Videos
from DataDomain.Model import Response
from ExternalApi.VideoFrontend.config import clear_video_overview_cache


class EditVideoHandler:
    """Handler for editing an existing video"""

    @staticmethod
    def handle() -> Response:
        """Update editable fields of a video by ID"""
        try:
            data = g.validated_data

            video_id: int = data.get('videoId')

            video = Videos.query.get(video_id)

            if not video:
                return Response(
                    response='Video does not exist',
                    status=404
                )

            if video.is_deleted:
                return Response(
                    response='Cannot edit a deleted video',
                    status=400
                )

            EditVideoHandler._apply_updates(video, data)

            video.save()

            clear_video_overview_cache()

            logging.info(f"EditVideo | Successfully updated video with ID: {video_id}")

            return Response(
                response={'message': 'Video successfully updated', 'id': video_id},
                status=200
            )

        except Exception as e:
            logging.error(f"Unexpected error in EditVideoHandler: {str(e)}")
            return Response(status=500)

    @staticmethod
    def _apply_updates(video: Videos, data: dict) -> None:
        """Apply only the fields that were explicitly provided in the request"""

        field_map = {
            'name': 'name',
            'category': 'category',
            'videoLink': 'video_link',
            'uploadDate': 'upload_date',
            'dateOfRecording': 'date_of_recording',
            'comment': 'comment',
            'topic': 'topic',
            'guests': 'guests',
            'weaponType': 'weapon_type',
            'gameSystem': 'game_system',
            'channelId': 'channel_id',
            'tournamentId': 'tournament_id',
            'teamOneId': 'team_one_id',
            'teamTwoId': 'team_two_id',
        }

        for request_key, model_attr in field_map.items():
            if request_key in data and data[request_key] is not None:
                setattr(video, model_attr, data[request_key])
