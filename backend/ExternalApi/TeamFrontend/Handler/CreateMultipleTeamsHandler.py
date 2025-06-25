
from flask import g

from config import cache
from DataDomain.Database import db
from DataDomain.Database.Model import Teams
from DataDomain.Database.Repository import TeamRepository
from DataDomain.Model import Response


class CreateMultipleTeamsHandler:

    @staticmethod
    def handle() -> Response:
        data = g.validated_data

        teams_data = data.get('teams')

        created_teams: list[dict] = []
        failed_teams: list[dict] = []
        existing_teams: list[dict] = []

        for i, team_data in enumerate(teams_data):
            try:
                if not team_data.get('name') or not team_data.get('city'):
                    failed_teams.append({
                        'name': team_data.get('name', 'Unknown'),
                        'reason': 'Missing required fields: name and city'
                    })
                    continue

                team = Teams(
                    name=team_data.get('name'),
                    city=team_data.get('city'),
                )

                if TeamRepository.checkIfTeamAlreadyExists(name=team.name):
                    existing_teams.append({
                        'name': team.name,
                    })
                    continue

                team_id = team.create()
                created_teams.append({
                    'name': team.name,
                    'id': team_id
                })

                if (i + 1) % 25 == 0:
                    try:
                        db.session.commit()
                    except Exception:
                        db.session.rollback()

            except Exception as e:
                failed_teams.append({
                    'name': team_data.get('name', 'Unknown'),
                    'reason': str(e)
                })
                continue

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

        response_data = {
            'created_teams': created_teams,
            'failed_teams': failed_teams,
            'existing_teams': existing_teams
        }

        if created_teams:
            cache.delete("team-overview")

        if failed_teams:
            return Response(
                response=response_data,
                status=400
            )

        if created_teams and existing_teams:
            return Response(
                response=response_data,
                status=207
            )

        return Response(
            response=response_data,
            status=200
        )
