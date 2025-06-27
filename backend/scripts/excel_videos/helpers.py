import math
import os
import sys
import warnings
from pathlib import Path
from typing import Any, Optional

import pandas as pd
import requests
from urllib3.exceptions import NotOpenSSLWarning

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))


base_host = os.getenv('BASE_HOST', 'localhost:8080')

# Suppress the specific urllib3 warning about LibreSSL
warnings.filterwarnings('ignore', category=NotOpenSSLWarning)


def clean_value(value: Any) -> Optional[str]:
    """Convert a value to a string, handling NaN and None values."""
    if pd.isna(value) or (
        isinstance(
            value, float) and (
            math.isnan(value) or math.isinf(value))):
        return None
    return str(value) if value else None


def send_data_to_backend(endpoint: str, data: dict, entity_name: str) -> bool:
    """Send data to the backend API."""
    print(f"=== SENDING {entity_name.upper()} TO BACKEND ===")

    try:
        url = f'https://{base_host}{endpoint}'

        # Add headers for better compatibility
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'JuggerTube-Excel-Processor/1.0'
        }

        response = requests.post(
            url,
            json=data,
            headers=headers,
            verify=False,
            timeout=60
        )

        print(f"Response Status Code: {response.status_code}")

        # Handle different response codes
        if response.status_code in [200, 207]:
            print(f"Successfully sent {entity_name} data to backend")
            if response.text:
                try:
                    response_data = response.json()
                    print(f"Response content: {response_data}")

                except ValueError:
                    print(f"Raw response: {response.text[:500]}...")
            return True
        elif response.status_code == 413:
            print(f"Request too large for {entity_name}. Consider reducing chunk size.")
            return False
        elif response.status_code == 400:
            print(f"Bad request for {entity_name}: {response.text}")
            return False
        else:
            print(f"Unexpected status code {response.status_code} for {entity_name}")
            print(f"Response content: {response.text[:500]}...")
            return False

    except requests.exceptions.Timeout:
        print(f"Timeout error sending {entity_name} data to backend")
        return False
    except requests.exceptions.ConnectionError as e:
        print(
            f"Connection Error: Could not connect to the server. Is it running? Error: {
                str(e)}")
        return False
    except requests.exceptions.RequestException as e:
        print(f"Request error sending {entity_name} data to backend: {str(e)}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print(f"Response content: {e.response.text[:500]}...")
        return False
    except Exception as e:
        print(f"Unexpected error sending {entity_name} data to backend: {str(e)}")
