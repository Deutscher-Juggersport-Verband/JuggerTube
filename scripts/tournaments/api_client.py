import os
import math
import time
import requests
from urllib3.exceptions import InsecureRequestWarning

# Disable SSL verification warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

base_host = os.getenv('BASE_URL', 'localhost:8080')


def send_data_in_chunks(endpoint, data_list, entity_name, chunk_size=100) -> dict:
    """
    Send data to backend in chunks of specified size with retry logic
    """
    
    total_chunks = math.ceil(len(data_list) / chunk_size)
    responses = []

    for i in range(total_chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, len(data_list))
        chunk = data_list[start_idx:end_idx]

        chunk_response = send_chunk_to_backend(
            endpoint,
            {f"{entity_name}": chunk},
            f"{entity_name} chunk {i + 1}/{total_chunks}"
        )

        responses.extend(chunk_response)

        if i < total_chunks - 1:
            delay = 3
            time.sleep(delay)

    return responses


def send_chunk_to_backend(endpoint: str, data: dict, entity_name: str) -> dict:
    """Send a single chunk of data to the backend API with enhanced logging and error handling."""

    response = []

    try:
        url = f'https://{base_host}{endpoint}'

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'JuggerTube-Tournament-Processor/1.0'
        }
        
        response = requests.post(
            url,
            json=data,
            headers=headers,
            verify=False,
            timeout=60
        )

        response.append(entity_name)
        
        if response.status_code in [200, 207]:
            response.append(f"Successfully sent {entity_name} data to backend")
            if response.text:
                try:
                    response_data = response.json()
                    response.append(f"Response content: {response_data}")
                except ValueError:
                    response.append(f"Raw response: {response.text[:500]}...")
            return response
        elif response.status_code == 413:
            response.append(f"Request too large for {entity_name}. Consider reducing chunk size.")
            return response
        elif response.status_code == 400:
            response.append(f"Bad request for {entity_name}: {response.text}")
            return response
        else:
            response.append(f"Unexpected status code {response.status_code} for {entity_name}")
            response.append(f"Response content: {response.text[:500]}...")
            return response
            
    except requests.exceptions.Timeout:
        response.append(f"Timeout error sending {entity_name} data to backend")
        return response
    except requests.exceptions.ConnectionError as e:
        response.append(f"Connection Error: Could not connect to the server. Is it running? Error: {str(e)}")
        return response
    except requests.exceptions.RequestException as e:
        response.append(f"Request error sending {entity_name} data to backend: {str(e)}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            response.append(f"Response content: {e.response.text[:500]}...")
        return response
    except Exception as e:
        response.append(f"Unexpected error sending {entity_name} data to backend: {str(e)}")
        return response


def send_teams(teams_data) -> dict:
    """Send teams data to the API in chunks"""
    if not teams_data:
        return []

    teams_list = list(teams_data.values()) if isinstance(teams_data, dict) else teams_data

    return send_data_in_chunks(
        '/api/team-frontend/create-multiple-teams',
        teams_list,
        'teams',
    )


def send_tournaments(tournaments_data) -> dict:
    """Send tournaments data to the API in chunks"""
    if not tournaments_data:
        return []

    tournaments_list = list(tournaments_data) if isinstance(tournaments_data, dict) else tournaments_data

    return send_data_in_chunks(
        '/api/tournament-frontend/create-multiple-tournaments',
        tournaments_list,
        'tournaments',
    )
