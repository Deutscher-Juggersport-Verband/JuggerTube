from flask import Blueprint

from config import cache
from DataDomain.Model import Response
from ExternalApi.ChannelFrontend.Handler import (
    CreateMultipleChannelsHandler,
    GetChannelOverviewHandler,
)
from ExternalApi.ChannelFrontend.InputFilter import (
    CreateMultipleChannelsInputFilter,
)

channel_frontend = Blueprint('channel-frontend', __name__)


@channel_frontend.route('/get-channel-overview',
                        methods=['GET'], endpoint='get-channel-overview')
@cache.cached(key_prefix='channel-overview')
def get_channel_overview() -> Response:
    return GetChannelOverviewHandler.handle()


@channel_frontend.route('/create-multiple-channels',
                        methods=['POST'], endpoint='create-multiple-channels')
@CreateMultipleChannelsInputFilter.validate()
# TODO: Remove after migrating to flask commands
def create_multiple_channels() -> Response:
    return CreateMultipleChannelsHandler.handle()
