from typing import Dict, List

from flask import g

from config import cache
from DataDomain.Database.Model import Tournaments
from DataDomain.Database.Repository import (
    TournamentRepository,
)
from DataDomain.Model import Response


class CreateMultipleTournamentsHandler:
    """Handler for creating multiple tournaments"""

    @staticmethod
    def handle() -> Response:
        """Create multiple tournaments from an array of tournament data"""
        data = g.validated_data
        tournaments_data = data.get('tournaments', [])

        if not tournaments_data:
            return Response(
                response='No tournaments provided',
                status=400
            )

        created_tournaments: List[Dict] = []
        failed_tournaments: List[Dict] = []

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
            'failed_tournaments': failed_tournaments
        }

        # If no tournaments were created successfully, return 400
        if not created_tournaments:
            return Response(
                response=response_data,
                status=400
            )

        cache.delete("tournament-overview")

        # If some tournaments failed but others succeeded, return 207 (Multi-Status)
        if failed_tournaments:
            return Response(
                response=response_data,
                status=207
            )

        # If all tournaments were created successfully, return 200
        return Response(
            response=response_data,
            status=200
        )
