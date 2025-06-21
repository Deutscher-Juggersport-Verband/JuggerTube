import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import math
import os
import time
from collections import defaultdict

import pandas as pd
import requests
from urllib3.exceptions import InsecureRequestWarning
from urllib3.exceptions import InsecureRequestWarning
import time
import math
from scripts.excel_videos.enums import TARGET_SHEETS, VideoCategoriesEnum
from scripts.excel_videos.data_processor import DataProcessor
from scripts.excel_videos.helpers import send_data_to_backend
from collections import defaultdict

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

base_host = os.getenv('BASE_URL', 'juggertube.de')

# Disable SSL verification warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Path to the Excel file
excel_file = os.path.join(script_dir, 'Liste aller Juggervideos _ JuggerTube.xlsx')

# Specify the sheets we want to analyze
target_sheets = ['DATA-Videos', 'DATA-Teams', 'DATA-Channels', 'Output-Tournaments']

# Read all sheets from the Excel file
excel = pd.ExcelFile(excel_file)

# Dictionaries to store channels and teams
channels_dict = {}
teams_dict = {}
videos_dict = {}

# Error tracking
error_tracking = defaultdict(list)

# Get valid category values
valid_categories = {category.value for category in VideoCategoriesEnum}


def send_data_in_chunks(endpoint, data_list, entity_name, chunk_size=100):
    """
    Send data to backend in chunks of specified size
    """
    total_chunks = math.ceil(len(data_list) / chunk_size)
    successful_chunks = 0
    failed_chunks = 0

    for i in range(total_chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, len(data_list))
        chunk = data_list[start_idx:end_idx]

        print(f"\nSending chunk {i + 1}/{total_chunks} of {entity_name}...")
        print(f"Processing {entity_name} {start_idx + 1} to {end_idx} of {len(data_list)}")

        try:
            success = send_data_to_backend(
                endpoint,
                {f"{entity_name}": chunk},
                f"{entity_name} chunk {i + 1}/{total_chunks}"
            )

            if success:
                print(f"Successfully sent chunk {i + 1} of {entity_name}")
                successful_chunks += 1
            else:
                print(f"Failed to send chunk {i + 1} of {entity_name}")
                failed_chunks += 1

        except Exception as e:
            print(f"Exception sending chunk {i + 1} of {entity_name}: {str(e)}")
            failed_chunks += 1

        # Wait between chunks (except for the last one)
        if i < total_chunks - 1:
            delay = 3
            time.sleep(delay)

    print(f"\nChunk sending completed for {entity_name}:")
    print(f"Successful chunks: {successful_chunks}/{total_chunks}")
    print(f"Failed chunks: {failed_chunks}/{total_chunks}")

    return successful_chunks == total_chunks


def main():
    # Check if Excel file exists
    if not os.path.exists(excel_file):
        print(f"Excel file not found: {excel_file}")
        return

    # Initialize data processor
    processor = DataProcessor(excel_file)

    # Process each sheet
    for sheet_name in TARGET_SHEETS:
        if sheet_name not in processor.excel.sheet_names:
            print(f"Warning: Sheet '{sheet_name}' not found in the Excel file.")
            continue

        df = pd.read_excel(excel_file, sheet_name=sheet_name)

        if sheet_name == 'DATA-Channels':
            processor.process_channels(df)
            print(f"Processed {len(processor.channels_dict)} channels")
        elif sheet_name == 'DATA-Teams':
            processor.process_teams(df)
            print(f"Processed {len(processor.teams_dict)} teams")
        elif sheet_name == 'DATA-Videos':
            processor.process_videos(df)
            print(f"Processed {len(processor.videos_dict)} videos")

    # Prepare and send data to backend
    teams_list, channels_list, videos_list = processor.prepare_data_for_api()
    print(f"Teams prepared: {len(teams_list)}")
    print(f"Channels prepared: {len(channels_list)}")
    print(f"Videos after validation: {len(videos_list)}")

    # Send teams data
    teams_success = send_data_to_backend(
        '/api/team-frontend/create-multiple-teams',
        {"teams": teams_list},
        'teams'
    )
    print(teams_success)

    # Send channels data
    print("\nProceeding with channels...")
    channels_success = send_data_in_chunks(
        '/api/channel-frontend/create-multiple-channels',
        channels_list,
        'channels',
    )
    print(f"Channels send result: {channels_success}")

    # Wait a bit before sending videos to allow backend processing
    time.sleep(2)

    # Send videos data
    print("\nProceeding with videos...")
    videos_success = send_data_in_chunks(
        '/api/video-frontend/create-multiple-videos',
        videos_list,
        'videos',
        chunk_size=100
    )

    # Print final status
    print("\nProcessing completed!")
    print(f"Teams status: {'Success' if teams_success else 'Failed'}")
    print(f"Channels status: {'Success' if channels_success else 'Failed'}")
    print(f"Videos status: {'Success' if videos_success else 'Failed'}")


if __name__ == "__main__":
    main()

# Function to check if a value is JSON serializable


def clean_value(value):
    if pd.isna(value) or (
        isinstance(
            value, float) and (
            math.isnan(value) or math.isinf(value))):
        return None
    return str(value) if value else None


print("\nAnalysis complete!")
