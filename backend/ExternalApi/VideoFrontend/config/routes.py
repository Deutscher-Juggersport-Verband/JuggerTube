from flask import Blueprint
from flask_jwt_extended import jwt_required

from config import cache, jwt_privileged_required, limiter
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
def get_video_overview() -> Response:
    return GetVideoOverviewHandler.handle()


@video_frontend.route('/get-paginated-videos',
                      methods=['GET'], endpoint='get-paginated-videos')
@GetPaginatedVideosInputFilter.validate()
def get_paginated_videos() -> Response:
    return GetPaginatedVideosHandler.handle()


@video_frontend.route('/get-pending-video-overview',
                      methods=['GET'], endpoint='get-pending-video-overview')
@jwt_required()
def get_pending_video_overview() -> Response:
    return GetPendingVideoOverviewHandler.handle()


@video_frontend.route('/create-video',
                      methods=['POST'], endpoint='create-video')
# @limiter.limit('45 per day, 15 per hour')
@jwt_required()
@CreateVideoInputFilter.validate()
def create_video() -> Response:
    return CreateVideoHandler.handle()


@video_frontend.route('/create-multiple-videos',
                      methods=['POST'], endpoint='create-multiple-videos')
# TODO: Remove after migrating to flask commands
@CreateMultipleVideosInputFilter.validate()
def create_multiple_videos() -> Response:
    return CreateMultipleVideosHandler.handle()


@video_frontend.route('/update-pending-video-status',
                      methods=['PUT'], endpoint='update-pending-video-status')
@jwt_privileged_required()
@UpdatePendingVideoStatusInputFilter.validate()
def update_pending_video_status() -> Response:
    return UpdatePendingVideoStatusHandler.handle()
