from sqlalchemy import func

from DataDomain.Database import db
from DataDomain.Database.Model import Teams


class TeamRepository:
    """Repository for team related queries"""

    @staticmethod
    def getTeamOverview() -> list[dict]:
        """Get all teams from database"""
        return db.session.query(
            Teams.id,
            Teams.name,
            Teams.city,
        ).filter(
            Teams.is_deleted != True
        ).order_by(
            Teams.name
        ).all()

    @staticmethod
    def getTeamIdByName(team_name: str) -> int | None:
        """Get Team by name"""

        team = db.session.query(
            Teams.id,
            Teams.name
        ).filter(
            Teams.is_deleted != True,
            func.lower(Teams.name) == func.lower(team_name)
        ).group_by(
            Teams.id
        ).first()

        if not team:
            return None

        return team.id
