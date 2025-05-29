import logging
import os
from datetime import datetime

# Configure logging
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

logging.basicConfig(
    filename=f'{log_dir}/validation_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def log_validation_error(message, data=None):
    """
    Log validation errors with optional data context
    """
    if data:
        logging.error(f"{message} - Data: {data}")
    else:
        logging.error(message) 