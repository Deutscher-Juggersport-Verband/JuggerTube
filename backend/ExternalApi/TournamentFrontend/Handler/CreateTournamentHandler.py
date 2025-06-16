from flask import g

from DataDomain.Database.Model import Tournaments
from DataDomain.Database.Repository import (
    TournamentRepository,
)
from DataDomain.Model import Response


class CreateTournamentHandler:
    """Handler for creating a tournament"""

    @staticmethod
    def handle() -> Response:
        """Create Video"""
        data = g.validated_data

        tournament = Tournaments(
            name=data.get('name'),
            city=data.get('city'),
            start_date=data.get('startDate'),
            end_date=data.get('endDate'),
            jtr_link=data.get('jtrLink')
        )

        if tournament.jtr_link:
            if TournamentRepository.checkIfJtrLinkAlreadyExists(tournament.jtr_link):
                return Response(
                    response='Tournament with this jtr link already exists',
                    status=400
                )

        if TournamentRepository.checkIfTournamentAlreadyExists(
                tournament.name, tournament.start_date):
            return Response(
                response='Tournament with this name and start date already exists',
                status=400
            )

        try:
            tournament_id = tournament.create()

        except Exception:
            return Response(status=500)

        return Response(
            response=tournament_id,
            status=200
        )
