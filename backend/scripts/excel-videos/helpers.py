import math
import os
import warnings
from typing import Any, Optional

import pandas as pd
import requests
from urllib3.exceptions import NotOpenSSLWarning

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
    try:
        response = requests.post(
            f'https://{base_host}{endpoint}',
            json=data,
            verify=False
        )
        if response.status_code == 207:
            print(f"Partial success for {entity_name}. Server message: {response.text}")
            return True
        response.raise_for_status()
        print(f"Successfully sent {entity_name} data to backend")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending {entity_name} data to backend: {str(e)}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print(f"Response content: {e.response.text}")
        return False
