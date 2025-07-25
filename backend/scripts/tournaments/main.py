import json
import os
import sys
from datetime import datetime
from pathlib import Path

import requests
from api_client import send_teams, send_tournaments
from cache_manager import load_cache, save_cache
from data_fetcher import DataFetcher
from date_utils import format_date
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from tournament_details_parser import parser as tournament_parser
from tournament_overview_parser import parser as overview_parser
from tournament_teams_parser import TournamentTeamsParser

from scripts.telegram_bot.send_messages.telegram_notifier import notify

# Add the backend directory to Python path for local development
current_dir = Path(__file__).parent
backend_dir = current_dir.parent.parent  # Go up to backend directory
sys.path.insert(0, str(backend_dir))


# Now we can import from scripts

# Disable SSL verification warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Cache file paths - use relative to script location
CACHE_DIR = current_dir.parent.parent.parent / "cache"
TOURNAMENTS_CACHE_FILE = CACHE_DIR / "tournaments_cache.json"
TEAMS_CACHE_FILE = CACHE_DIR / "teams_cache.json"

tournament_url = 'https://turniere.jugger.org/'
previous_suffix = 'index.event.php#previous'
tournament_suffix = 'tournament.php?id='
results_suffix = 'tournament.result.php?id='

# change url depending on the environment
base_host = os.getenv('BASE_URL', 'localhost:8080')

add_tournaments_url = f'https://{base_host}/api/tournament-frontend/create-multiple-tournaments'
add_teams_url = f'https://{base_host}/api/team-frontend/create-multiple-teams'


def ensure_cache_dir():
    """Ensure the cache directory exists"""
    CACHE_DIR.mkdir(exist_ok=True)


def load_cache():
    """Load cached tournament and team data"""
    ensure_cache_dir()
    tournaments_cache = {}
    teams_cache = {}

    try:
        if TOURNAMENTS_CACHE_FILE.exists():
            with open(TOURNAMENTS_CACHE_FILE, 'r') as f:
                tournaments_cache = json.load(f)
    except Exception as e:
        print(f"Error loading tournaments cache: {e}")

    try:
        if TEAMS_CACHE_FILE.exists():
            with open(TEAMS_CACHE_FILE, 'r') as f:
                teams_cache = json.load(f)
    except Exception as e:
        print(f"Error loading teams cache: {e}")

    return tournaments_cache, teams_cache


def save_cache(tournaments_data, teams_data):
    """Save tournament and team data to cache files"""
    ensure_cache_dir()

    try:
        with open(TOURNAMENTS_CACHE_FILE, 'w') as f:
            json.dump(tournaments_data, f, indent=2)
    except Exception as e:
        print(f"Error saving tournaments cache: {e}")

    try:
        with open(TEAMS_CACHE_FILE, 'w') as f:
            json.dump(teams_data, f, indent=2)
    except Exception as e:
        print(f"Error saving teams cache: {e}")


def format_date(date_str):
    """Format date string to ISO format with time"""
    if not date_str:
        return None
    try:
        # First try to parse date with time (format: DD.MM.YYYY HH:mm Uhr)
        try:
            parsed_date = datetime.strptime(date_str.strip(), '%d.%m.%Y %H:%M Uhr')
            return parsed_date.strftime('%Y-%m-%d %H:%M:%S.%f')
        except ValueError:
            # If that fails, try just the date (format: DD.MM.YYYY)
            parsed_date = datetime.strptime(date_str.strip(), '%d.%m.%Y')
            # For dates without time, set to start of day
            return parsed_date.strftime('%Y-%m-%d 00:00:00.000000')
    except ValueError as e:
        print(f"Error parsing date '{date_str}': {e}")
        return None


def get_teams_from_tournament(tournament_id):
    """Fetch and parse teams from a tournament's results page"""
    results_url = tournament_url + results_suffix + tournament_id
    try:
        response = requests.get(results_url, verify=False)
        parser = TournamentTeamsParser()
        parser.feed(response.text)
        return parser.get_teams()
    except Exception as e:
        print(f"Error fetching teams for tournament {tournament_id}: {str(e)}")
        return []


def process_tournament(data_fetcher, tournament):
    """Process a single tournament and return its data"""
    tournament_id = tournament.tournament_id

    # Get the start date from overview
    start_date = format_date(tournament.start_date)
    if not start_date:
        print(f"Warning: Could not parse date for tournament {tournament.name}")
        return None

    # Fetch and parse the tournament details page to get end date and teams
    try:
        details_html, details_url = data_fetcher.fetch_tournament_details(tournament_id)

        # Parse tournament details
        tournament_parser.feed(details_html)
        dates = tournament_parser.get_dates()
        tournament_name = tournament_parser.get_name()
        tournament_parser.__init__()

        # Use end date from details if available, otherwise use start date
        end_date = format_date(dates['end_date']) if dates['end_date'] else start_date

        details_name = tournament_name
        overview_name = tournament.name

        # Use name from details page if available, otherwise use overview name
        final_name = details_name if details_name else overview_name

        return {
            "name": final_name,
            "city": tournament.city,
            "startDate": start_date,
            "endDate": end_date,
            "jtrLink": details_url
        }
    except Exception as e:
        print(f"Error processing tournament {tournament.name}: {str(e)}")
        return None


def main():
    # Initialize components
    data_fetcher = DataFetcher()

    # Load cached data
    cached_tournaments, cached_teams = load_cache()

    # Dictionary to store unique teams by name and city
    unique_teams = cached_teams.copy() if cached_teams else {}
    tournaments_data = []

    # Fetch and parse tournaments overview
    juggertube_html = data_fetcher.fetch_previous_tournaments()
    overview_parser.feed(juggertube_html)

    # Keep track of new tournaments to add to cache
    new_tournaments = []
    found_cached_tournament = False

    # Process each tournament
    for tournament in overview_parser.tournament_array:
        tournament_id = tournament.tournament_id

        # Check if tournament is already in cache
        if tournament_id in cached_tournaments:
            found_cached_tournament = True
            tournaments_data.append(cached_tournaments[tournament_id])
            continue

        if found_cached_tournament:
            continue

        # Process tournament
        tournament_dict = process_tournament(data_fetcher, tournament)
        if tournament_dict:
            tournaments_data.append(tournament_dict)
            new_tournaments.append((tournament_id, tournament_dict))
            print(f"Added tournament: {tournament.name} ({tournament_id})")

            # Fetch teams for this tournament
            teams = data_fetcher.fetch_tournament_teams(tournament_id)
            for team in teams:
                team_key = f"{team['name']}|{team['city']}"
                unique_teams[team_key] = team
                print(f"Found team: {team['name']} from {team['city']}")

    # Update cache with new tournaments
    for tournament_id, tournament_data in new_tournaments:
        cached_tournaments[tournament_id] = tournament_data

    # Save updated cache
    save_cache(cached_tournaments, unique_teams)

    # Send data to APIs
    tournaments_success = send_tournaments(tournaments_data)
    teams_success = send_teams(unique_teams)

    response_message = "\n"

    if tournaments_success:
        response_message += "=== TOURNAMENTS ===\n"
        response_message += "\n".join(tournaments_success)
        response_message += "\n\n"

    if teams_success:
        response_message += "=== TEAMS ===\n"
        response_message += "\n".join(teams_success)
        response_message += "\n"

    # Remove trailing newlines if message is empty
    response_message = response_message.strip()

    notify("Turniere und Teams wurden importiert", response_message)


if __name__ == '__main__':
    main()
