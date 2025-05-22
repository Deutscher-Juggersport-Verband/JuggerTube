from typing import List

from DataDomain.Database import db
from DataDomain.Database.Model import Teams
from Infrastructure.Logger import logger
from sqlalchemy import func


class TeamRepository:
    """Repository for team related queries"""

    @staticmethod
    def getTeamOverview() -> List[dict]:
        """Get all teams from database"""
        teams = (db.session.query(
            Teams.id,
            Teams.name,
            Teams.city,
            Teams.country
        ).filter(
            Teams.is_deleted != True
        ).order_by(
            Teams.name
        ).all())

        result = []
        for team in teams:
            team_dict = {
                'id': team.id,
                'name': team.name,
                'city': team.city,
                'country': team.country
            }
            result.append(team_dict)

        return result

    @staticmethod
    def create(team: Teams) -> int:
        try:
            db.session.add(team)
            db.session.commit()

            logger.info(
                f'TeamRepository | Create | created team {team.id}')

            return team.id

        except Exception as e:
            db.session.rollback()
            logger.error(f'TeamRepository | Create | {e}')
            raise e

    @staticmethod
    def getTeamIdByName(teamName: str) -> int | None:
        """Get Team by name"""

        team = db.session.query(
            Teams.id,
            Teams.name
        ).filter(
            Teams.is_deleted != True,
            func.lower(Teams.name) == func.lower(teamName)
        ).group_by(
            Teams.id
        ).first()

        if not team:
            return None

        return team.id
