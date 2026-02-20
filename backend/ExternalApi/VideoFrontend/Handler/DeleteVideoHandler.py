import logging

from flask import g

from DataDomain.Database.Model import Videos
from DataDomain.Model import Response
from ExternalApi.VideoFrontend.config import clear_video_overview_cache


class DeleteVideoHandler:
    """Handler for deleting a video"""

    @staticmethod
    def handle() -> Response:
        """Soft-delete a video by ID"""
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
                    response='Video is already deleted',
                    status=400
                )

            video.shadow()

            clear_video_overview_cache()

            logging.info(f"DeleteVideo | Successfully soft-deleted video with ID: {video_id}")

            return Response(
                response={'message': 'Video successfully deleted', 'id': video_id},
                status=200
            )

        except Exception as e:
            logging.error(f"Unexpected error in DeleteVideoHandler: {str(e)}")
            return Response(status=500)
