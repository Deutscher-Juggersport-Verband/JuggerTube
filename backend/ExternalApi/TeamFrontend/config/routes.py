from flask import Blueprint

from config import cache
from DataDomain.Model import Response
from ExternalApi.TeamFrontend.Handler import (
    CreateMultipleTeamsHandler,
    GetTeamOverviewHandler,
)
from ExternalApi.TeamFrontend.InputFilter import (
    CreateMultipleTeamsInputFilter,
)

team_frontend = Blueprint('team-frontend', __name__)


@team_frontend.route('/get-team-overview',
                     methods=['GET'], endpoint='get-team-overview')
@cache.cached(key_prefix='team-overview')
def get_team_overview() -> Response:
    return GetTeamOverviewHandler.handle()


@team_frontend.route('/create-multiple-teams',
                     methods=['POST'], endpoint='create-multiple-teams')
# TODO: Remove after migrating to flask commands
@CreateMultipleTeamsInputFilter.validate()
def create_multiple_teams() -> Response:
    return CreateMultipleTeamsHandler.handle()
