
from flask import g

from config import cache
from DataDomain.Database.Model import Tournaments
from DataDomain.Database.Repository import (
    TournamentRepository,
)
from DataDomain.Model import Response


class CreateMultipleTournamentsHandler:

    @staticmethod
    def handle() -> Response:

        data = g.validated_data
        tournaments_data = data.get('tournaments', [])

        if not tournaments_data:
            return Response(
                response='No tournaments provided',
                status=400
            )

        created_tournaments: list[dict] = []
        failed_tournaments: list[dict] = []
        existing_tournaments: list[dict] = []

        for tournament_data in tournaments_data:
            try:
                tournament = Tournaments(
                    name=tournament_data.get('name'),
                    city=tournament_data.get('city'),
                    start_date=tournament_data.get('startDate'),
                    end_date=tournament_data.get('endDate'),
                    jtr_link=tournament_data.get('jtrLink')
                )

                # Check if tournament already exists
                if TournamentRepository.checkIfTournamentAlreadyExists(
                        tournament.name, tournament.start_date):
                    existing_tournaments.append({
                        'name': tournament.name,
                        'start_date': tournament.start_date
                    })
                    continue

                if tournament.jtr_link:
                    if TournamentRepository.checkIfJtrLinkAlreadyExists(
                            tournament.jtr_link):
                        existing_tournaments.append({
                            'name': tournament.name,
                            'jtr_link': tournament.jtr_link
                        })
                        continue

                tournament_id = tournament.create()
                created_tournaments.append({
                    'name': tournament.name,
                    'id': tournament_id
                })
            except Exception as e:
                failed_tournaments.append({
                    'name': tournament_data.get('name', 'Unknown'),
                    'reason': str(e)
                })

        response_data = {
            'created_tournaments': created_tournaments,
            'failed_tournaments': failed_tournaments,
            'existing_tournaments': existing_tournaments
        }

        # If there are actual failures, return 400
        if failed_tournaments:
            return Response(
                response=response_data,
                status=400
            )

        # If no tournaments were created and none exist, return 400 (no valid
        # tournaments provided)
        if not created_tournaments and not existing_tournaments:
            return Response(
                response=response_data,
                status=400
            )

        cache.delete("tournament-overview")

        # If some tournaments were created and some already existed, return 207
        # (Multi-Status)
        if created_tournaments and existing_tournaments:
            return Response(
                response=response_data,
                status=207
            )

        # If all tournaments already existed, return 200 (success - tournaments
        # are available)
        if existing_tournaments and not created_tournaments:
            return Response(
                response=response_data,
                status=200
            )

        # If all tournaments were created successfully, return 200
        return Response(
            response=response_data,
            status=200
        )
