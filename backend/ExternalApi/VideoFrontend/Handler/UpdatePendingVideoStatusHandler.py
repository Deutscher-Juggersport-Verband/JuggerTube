from flask import g

from BusinessDomain.User.Rule import IsCurrentUserPrivilegedRule
from DataDomain.Database.Model import Videos
from DataDomain.Model import Response
from ExternalApi.VideoFrontend.config.extensions import clearCompleteVideoCache


class UpdatePendingVideoStatusHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data

        video_id: int = data.get('videoId')

        if not IsCurrentUserPrivilegedRule.applies():
            return Response(403)

        video = Videos.query.get(video_id)

        if not video:
            return Response(
                response='Video does not exist',
                status=404
            )

        try:
            video.status = data.get('status')

            video.save()

            clearCompleteVideoCache()

        except Exception:
            return Response(status=500)

        return Response(
            status=200
        )
