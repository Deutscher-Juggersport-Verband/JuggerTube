import os
import sys
from pathlib import Path

import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))


# Disable SSL verification warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# API configuration
base_host = os.getenv('BASE_HOST', 'localhost:8080')
CREATE_VIDEOS_URL = f'https://{base_host}/api/video-frontend/create-multiple-videos'


def send_videos_to_api(videos_data):
    """Send video data to the API and handle responses"""
    if not videos_data:
        return

    payload = {"videos": videos_data}
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': base_host
    }

    try:
        response = requests.post(
            CREATE_VIDEOS_URL,
            json=payload,
            headers=headers,
            verify=False  # Disable SSL verification for local development only
        )
        print(f"API Response Status: {response.status_code}")
        print(f"{response.text}")

        # Handle non-200 status codes
        if response.status_code != 200:
            print(f"Error: Server returned status code {response.status_code}")

        return response

    except requests.exceptions.ConnectionError as e:
        print(
            f"Connection Error: Could not connect to the server. Is it running? Error: {
                str(e)}")
        return None
    except Exception as e:
        print(f"Error sending data to API: {str(e)}")
        return None
