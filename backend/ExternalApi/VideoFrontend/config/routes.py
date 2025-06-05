from flask import Blueprint
from flask_jwt_extended import jwt_required

from config import cache
from DataDomain.Model import Response
from ExternalApi.VideoFrontend.Handler import (
    CreateMultipleVideosHandler,
    CreateVideoHandler,
    GetPaginatedVideosHandler,
    GetPendingVideoOverviewHandler,
    GetVideoOverviewHandler,
    UpdatePendingVideoStatusHandler,
)
from ExternalApi.VideoFrontend.InputFilter import (
    CreateMultipleVideosInputFilter,
    CreateVideoInputFilter,
    GetPaginatedVideosInputFilter,
    UpdatePendingVideoStatusInputFilter,
)

video_frontend = Blueprint('video-frontend', __name__)


@video_frontend.route('/get-video-overview',
                      methods=['GET'], endpoint='get-video-overview')
@cache.cached(key_prefix='video-overview')
def getVideoOverview() -> Response:
    return GetVideoOverviewHandler.handle()


@video_frontend.route('/get-paginated-videos',
                      methods=['GET'], endpoint='get-paginated-videos')
@GetPaginatedVideosInputFilter.validate()
@cache.cached(key_prefix='paginated-videos')
def getPaginatedVideos() -> Response:
    return GetPaginatedVideosHandler.handle()


@video_frontend.route('/create-video',
                      methods=['POST'], endpoint='create-video')
@CreateVideoInputFilter.validate()
@cache.cached(key_prefix='create-video')
def createVideo() -> Response:
    return CreateVideoHandler.handle()


@video_frontend.route('/create-multiple-videos',
                      methods=['POST'], endpoint='create-multiple-videos')
@CreateMultipleVideosInputFilter.validate()
def createMultipleVideos() -> Response:
    return CreateMultipleVideosHandler.handle()


@video_frontend.route('/get-pending-video-overview',
                      methods=['GET'], endpoint='get-pending-video-overview')
@cache.cached(key_prefix='pending-video-overview')
@jwt_required()
def getPendingVideoOverview() -> Response:
    return GetPendingVideoOverviewHandler.handle()


@video_frontend.route('/update-pending-video-status',
                      methods=['PUT'], endpoint='update-pending-video-status')
@jwt_required()
@UpdatePendingVideoStatusInputFilter.validate()
def updatePendingVideoStatus() -> Response:
    return UpdatePendingVideoStatusHandler.handle()
