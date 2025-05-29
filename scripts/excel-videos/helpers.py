import os

import pandas as pd
import math
import requests
import warnings
from urllib3.exceptions import NotOpenSSLWarning
from typing import Any, Dict, Optional

base_host = os.getenv('BASE_HOST', 'localhost:8080')

# Suppress the specific urllib3 warning about LibreSSL
warnings.filterwarnings('ignore', category=NotOpenSSLWarning)

def clean_value(value: Any) -> Optional[str]:
    """Convert a value to a string, handling NaN and None values."""
    if pd.isna(value) or (isinstance(value, float) and (math.isnan(value) or math.isinf(value))):
        return None
    return str(value) if value else None
