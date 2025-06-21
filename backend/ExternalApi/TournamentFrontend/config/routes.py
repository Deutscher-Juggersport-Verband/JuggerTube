from flask import Blueprint

from config import cache
from DataDomain.Model import Response
from ExternalApi.TournamentFrontend.Handler.CreateMultipleTournamentsHandler import (
    CreateMultipleTournamentsHandler,
)
from ExternalApi.TournamentFrontend.Handler.GetTournamentOverviewHandler import (
    GetTournamentOverviewHandler,
)
from ExternalApi.TournamentFrontend.InputFilter import (
    CreateMultipleTournamentsInputFilter,
)

tournament_frontend = Blueprint('tournament-frontend', __name__)


@tournament_frontend.route('/get-tournament-overview',
                           methods=['GET'], endpoint='get-tournament-overview')
@cache.cached(key_prefix='tournament-overview')
def get_tournament_overview() -> Response:
    return GetTournamentOverviewHandler.handle()


@tournament_frontend.route('/create-multiple-tournaments',
                           methods=['POST'], endpoint='create-multiple-tournaments')
# TODO: Remove after migrating to flask commands
@CreateMultipleTournamentsInputFilter.validate()
def create_multiple_tournaments() -> Response:
    return CreateMultipleTournamentsHandler.handle()
