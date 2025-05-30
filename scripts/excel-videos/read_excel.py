import os

import pandas as pd
import requests
from urllib3.exceptions import InsecureRequestWarning
import time
import math
from enums import TARGET_SHEETS, VideoCategoriesEnum
from data_processor import DataProcessor
from helpers import send_data_to_backend
from collections import defaultdict

base_host = os.getenv('BASE_URL', 'juggertube.de')

# Disable SSL verification warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Path to the Excel file
excel_file = 'Liste aller Juggervideos _ JuggerTube.xlsx'

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
    all_success = True
    
    for i in range(total_chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, len(data_list))
        chunk = data_list[start_idx:end_idx]
        
        print(f"\nSending chunk {i + 1}/{total_chunks} of {entity_name}...")
        print(f"Processing videos {start_idx + 1} to {end_idx} of {len(data_list)}")
        print(f"First video in chunk: {chunk[0]['name'] if chunk else 'No videos'}")
        print(f"Last video in chunk: {chunk[-1]['name'] if chunk else 'No videos'}")
        
        success = send_data_to_backend(
            endpoint,
            {f"{entity_name}": chunk},
            f"{entity_name} chunk {i + 1}/{total_chunks}"
        )
        
        if not success:
            all_success = False
            print(f"Failed to send chunk {i + 1} of {entity_name}")
        
        # Add a small delay between chunks to prevent overwhelming the server
        if i < total_chunks - 1:
            time.sleep(1)
    
    return all_success

def send_data_to_backend(endpoint, data, entity_name):
    try:
        response = requests.post(
            f'https://{base_host}{endpoint}',
            json=data,
            verify=False
        )
        
        if response.status_code == 400:
            error_data = response.json()
            print(f"\nError details for {entity_name}:")
            print(f"Response: {error_data}")
            
            # Track failed items
            if 'failed_teams' in error_data:
                for team in error_data['failed_teams']:
                    error_msg = team.get('error', '')
                    if 'already exists' not in error_msg:
                        error_tracking['teams'].append(f"{team.get('name', 'Unknown team')}: {error_msg}")
            elif 'failed_channels' in error_data:
                for channel in error_data['failed_channels']:
                    error_msg = channel.get('error', '')
                    if 'already exists' not in error_msg:
                        error_tracking['channels'].append(f"{channel.get('name', 'Unknown channel')}: {error_msg}")
            elif 'errors' in error_data:
                for error in error_data['errors']:
                    error_msg = error.get('message', '')
                    if 'already exists' not in error_msg:
                        if 'Tournament not found' in error_msg:
                            tournament = error_msg.split(': ')[-1]
                            error_tracking['tournaments'].append(tournament)
                        elif 'Channel does not exist' in error_msg:
                            channel = error_msg.split(': ')[-1]
                            error_tracking['channels'].append(channel)
                        else:
                            error_tracking['other_errors'].append(error_msg)
        else:
            # Print success details for videos
            if entity_name.startswith('videos'):
                success_data = response.json()
                if 'created_videos' in success_data:
                    print(f"\nSuccessfully created {len(success_data['created_videos'])} videos")
                    if 'failed_videos' in success_data and success_data['failed_videos']:
                        print(f"Failed to create {len(success_data['failed_videos'])} videos")
                        for failed in success_data['failed_videos']:
                            print(f"- {failed.get('name', 'Unknown')}: {failed.get('error', 'Unknown error')}")
        
        response.raise_for_status()
        print(f"\nSuccessfully sent {entity_name} data to backend")
        return True
    except requests.exceptions.RequestException as e:
        print(f"\nError sending {entity_name} data to backend: {str(e)}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print(f"Response content: {e.response.text}")
        return False

def main():
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
        elif sheet_name == 'DATA-Teams':
            processor.process_teams(df)
        elif sheet_name == 'DATA-Videos':
            processor.process_videos(df)
            print(f"\nTotal videos in Excel: {len(df)}")

    # Prepare and send data to backend
    teams_list, channels_list, videos_list = processor.prepare_data_for_api()
    print(f"\nVideos after validation: {len(videos_list)}")

    # Send teams data
    teams_success = send_data_to_backend(
        '/api/team-frontend/create-multiple-teams',
        {"teams": teams_list},
        'teams'
    )

    # Send channels data
    print("\nProceeding with channels...")
    channels_success = send_data_to_backend(
        '/api/channel-frontend/create-multiple-channels',
        {"channels": channels_list},
        'channels'
    )

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
    
    # Print error summary
    print("\nError Summary:")
    for error_type, errors in error_tracking.items():
        if errors:  # Only show non-empty error lists
            print(f"\n{error_type.upper()} errors ({len(errors)}):")
            for error in errors[:10]:  # Show first 10 errors
                print(f"- {error}")
            if len(errors) > 10:
                print(f"... and {len(errors) - 10} more errors")

if __name__ == "__main__":
    main()

# Function to check if a value is JSON serializable
def clean_value(value):
    if pd.isna(value) or (isinstance(value, float) and (math.isnan(value) or math.isinf(value))):
        return None
    return str(value) if value else None

print("\nAnalysis complete!") 