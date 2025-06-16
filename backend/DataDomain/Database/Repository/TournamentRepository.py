
from sqlalchemy import func

from DataDomain.Database import db
from DataDomain.Database.Model import Tournaments


class TournamentRepository:
    """Repository for tournament related queries"""

    @staticmethod
    def getTournamentOverview() -> list[dict]:
        """get all Tournaments queries"""
        return db.session.query(
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
        ).all()

    @staticmethod
    def getTournamentByName(tournament_name: str) -> int | None:
        """get Tournament ID by Name"""
        return db.session.query(
            Tournaments.id
        ).filter(
            Tournaments.is_deleted != True,
            func.lower(Tournaments.name) == func.lower(tournament_name)
        ).scalar()

    @staticmethod
    def checkIfTournamentAlreadyExists(name: str, start_date) -> bool:
        return db.session.query(
            Tournaments.id,
            Tournaments.start_date
        ).filter(
            Tournaments.is_deleted != True,
            func.lower(Tournaments.name) == func.lower(name),
            Tournaments.start_date == start_date
        ).first() is not None
