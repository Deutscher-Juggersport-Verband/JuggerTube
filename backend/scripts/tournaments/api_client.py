import os

import requests

base_host = os.getenv('BASE_URL', 'localhost:8080')


class ApiClient:
    def __init__(self):
        self.base_url = f'https://{base_host}'
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Host': base_host
        }

    def send_tournaments(self, tournaments_data):
        """Send tournaments data to the API"""
        if not tournaments_data:
            return

        url = f"{self.base_url}/api/tournament-frontend/create-multiple-tournaments"
        payload = {"tournaments": tournaments_data}

        try:
            response = requests.post(
                url,
                json=payload,
                headers=self.headers,
                verify=False
            )
            print(f"Tournaments API Response Status: {response.status_code}")
            if response.status_code != 200:
                print(f"Error: Server returned status code {response.status_code}")
            if response.text:
                try:
                    print(f"Response content: {response.json()}")
                except ValueError:
                    print(f"Raw response: {response.text}")
            return response
        except requests.exceptions.ConnectionError as e:
            print(
                f"Connection Error: Could not connect to the server. Is it running? Error: {str(e)}")
        except Exception as e:
            print(f"Error sending tournament data to API: {str(e)}")

    def send_teams(self, teams_data):
        """Send teams data to the API"""
        if not teams_data:
            return

        url = f"{self.base_url}/api/team-frontend/create-multiple-teams"
        teams_list = list(teams_data.values())
        payload = {"teams": teams_list}

        try:
            print(f"\nSending {len(teams_list)} unique teams to API")
            response = requests.post(
                url,
                json=payload,
                headers=self.headers,
                verify=False
            )
            print(f"Teams API Response Status: {response.status_code}")
            if response.status_code != 200:
                print(f"Error: Server returned status code {response.status_code}")
            if response.text:
                try:
                    print(f"Response content: {response.json()}")
                except ValueError:
                    print(f"Raw response: {response.text}")
            return response
        except requests.exceptions.ConnectionError as e:
            print(
                f"Connection Error: Could not connect to the server. Is it running? Error: {str(e)}")
        except Exception as e:
            print(f"Error sending teams data to API: {str(e)}")
