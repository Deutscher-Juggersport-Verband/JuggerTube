from typing import List

from sqlalchemy import func

from DataDomain.Database import db
from DataDomain.Database.Model import Tournaments


class TournamentRepository:
    """Repository for tournament related queries"""

    @staticmethod
    def getTournamentOverview() -> List[dict]:
        """get all Tournaments queries"""
        tournaments = (db.session.query(
            Tournaments.id,
            Tournaments.name,
            Tournaments.city,
            Tournaments.start_date,
            Tournaments.end_date,
            Tournaments.jtr_link
        ).filter(
            Tournaments.is_deleted != True
        ).order_by(
            Tournaments.name
        ).all())

        result = []
        for tournament in tournaments:
            tournament_dict = {
                'id': tournament.id,
                'name': tournament.name,
                'city': tournament.city,
                'start_date': tournament.start_date,
                'end_date': tournament.end_date,
                'jtr_link': tournament.jtr_link or ''
            }
            result.append(tournament_dict)

        return result

    @staticmethod
    def getTournamentByName(tournament_name: str) -> int | None:
        """get Tournament ID by Name"""
        tournament = (db.session.query(
            Tournaments.id
        ).filter(
            Tournaments.is_deleted != True,
            func.lower(Tournaments.name) == func.lower(tournament_name)
        ).scalar())

        return tournament

    @staticmethod
    def checkIfTournamentAlreadyExists(name: str, start_date) -> bool:
        tournament = (db.session.query(
            Tournaments.id,
            Tournaments.start_date
        ).filter(
            Tournaments.is_deleted != True,
            func.lower(Tournaments.name) == func.lower(name),
            Tournaments.start_date == start_date
        ).first())

        return tournament is not None
