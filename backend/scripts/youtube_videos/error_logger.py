import glob
import json
import os
from datetime import datetime
from pathlib import Path

# Error logging configuration
CACHE_DIR = Path("cache")
ERROR_LOG_DIR = CACHE_DIR / "error_logs"
ERROR_LOG_PATTERN = "youtube_errors_*.json"


def ensure_cache_dir():
    """Ensure the cache directory exists"""
    CACHE_DIR.mkdir(exist_ok=True)
    ERROR_LOG_DIR.mkdir(exist_ok=True)


def get_latest_error_log_file():
    """Get the path of the latest error log file"""
    error_files = glob.glob(str(ERROR_LOG_DIR / ERROR_LOG_PATTERN))
    if not error_files:
        return None
    return max(error_files, key=os.path.getctime)


def load_error_log():
    """Load existing error log from the latest file"""
    ensure_cache_dir()
    error_log = []

    try:
        latest_file = get_latest_error_log_file()
        if latest_file:
            with open(latest_file, 'r') as f:
                error_log = json.load(f)
    except Exception as e:
        print(f"Error loading error log: {e}")

    return error_log


def save_error_log(error_log):
    """Save error log to a new file with timestamp"""
    ensure_cache_dir()

    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        error_file = ERROR_LOG_DIR / f"youtube_errors_{timestamp}.json"
        with open(error_file, 'w') as f:
            json.dump(error_log, f, indent=2)
    except Exception as e:
        print(f"Error saving error log: {e}")


def log_video_error(
        video_name,
        tournament_name,
        team_one_name,
        team_two_name,
        error_message):
    """Log video processing error with relevant details"""
    if "Video with this name already exists" in error_message:
        return

    error_log = load_error_log()
    error_entry = {
        "timestamp": datetime.now().isoformat(),
        "videoName": video_name,
        "tournamentName": tournament_name,
        "teamOneName": team_one_name,
        "teamTwoName": team_two_name,
        "errorMessage": error_message
    }
    error_log.append(error_entry)
    save_error_log(error_log)
