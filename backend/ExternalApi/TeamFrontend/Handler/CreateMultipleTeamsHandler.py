from typing import Dict, List

from flask import g

from DataDomain.Database.Model import Teams
from DataDomain.Database.Repository import TeamRepository
from DataDomain.Model import Response


class CreateMultipleTeamsHandler:

    @staticmethod
    def handle() -> Response:
        data = g.validated_data
        teams_data = data.get('teams')

        created_teams: List[Dict] = []
        failed_teams: List[Dict] = []

        for team_data in teams_data:
            try:
                team = Teams(
                    name=team_data.get('name'),
                    city=team_data.get('city'),
                )

                # Check if team already exists
                if TeamRepository.getTeamIdByName(team.name):
                    continue

                team_id = TeamRepository.create(team)
                created_teams.append({
                    'name': team.name,
                    'id': team_id
                })
            except Exception as e:
                failed_teams.append({
                    'name': team_data.get('name', 'Unknown'),
                    'reason': str(e)
                })

        response_data = {
            'created_teams': created_teams,
            'failed_teams': failed_teams
        }

        # If no teams were created successfully, return 400
        if not created_teams:
            return Response(
                response=response_data,
                status=400
            )

        # If some teams failed but others succeeded, return 207 (Multi-Status)
        if failed_teams:
            return Response(
                response=response_data,
                status=207
            )

        # If all teams were created successfully, return 200
        return Response(
            response=response_data,
            status=200
        )
