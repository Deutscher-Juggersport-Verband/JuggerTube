from typing import Dict, List

from flask import g

from config import cache
from DataDomain.Database.Model import Teams
from DataDomain.Database.Repository import TeamRepository
from DataDomain.Database import db
from DataDomain.Model import Response


class CreateMultipleTeamsHandler:

    @staticmethod
    def handle() -> Response:
        try:
            if not hasattr(g, 'validated_data'):
                return Response(
                    response={'error': 'No validated data provided'},
                    status=400
                )
            
            data = g.validated_data

            teams_data = data.get('teams')
            if not teams_data:
                return Response(
                    response={'error': 'No teams data provided'},
                    status=400
                )

            if len(teams_data) > 1000:
                return Response(
                    response={'error': f'Too many teams requested: {len(teams_data)}. Maximum allowed: 1000'},
                    status=413
                )

            created_teams: List[Dict] = []
            failed_teams: List[Dict] = []
            existing_teams: List[Dict] = []

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

                    existing_team_id = TeamRepository.checkIfTeamAlreadyExists(team_name=team.name)
                    if existing_team_id:
                        existing_teams.append({
                            'name': team.name,
                            'id': existing_team_id
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
                        except Exception as commit_error:
                            db.session.rollback()

                except Exception as e:
                    failed_teams.append({
                        'name': team_data.get('name', 'Unknown'),
                        'reason': str(e)
                    })
                    continue

            try:
                db.session.commit()
            except Exception as commit_error:
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

            if not created_teams and not existing_teams:
                return Response(
                    response=response_data,
                    status=400
                )

            if created_teams and existing_teams:
                return Response(
                    response=response_data,
                    status=207
                )

            if existing_teams and not created_teams:
                return Response(
                    response=response_data,
                    status=200
                )

            return Response(
                response=response_data,
                status=200
            )
            
        except Exception as e:
            try:
                db.session.rollback()
            except:
                pass
            return Response(
                response={'error': f'Internal server error: {str(e)}'},
                status=500
            )
