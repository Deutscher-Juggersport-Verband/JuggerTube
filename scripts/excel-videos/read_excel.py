import os
import pandas as pd
import requests
from urllib3.exceptions import InsecureRequestWarning
import time
import math
from enums import TARGET_SHEETS, VideoCategoriesEnum
from data_processor import DataProcessor

base_host = 'juggertube.de'

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

excel_file = os.path.join(os.path.dirname(__file__), 'Liste aller Juggervideos _ JuggerTube.xlsx')

target_sheets = ['DATA-Videos', 'DATA-Teams', 'DATA-Channels', 'Output-Tournaments']

excel = pd.ExcelFile(excel_file)

channels_dict = {}
teams_dict = {}
videos_dict = {}

# Get valid category values
valid_categories = {category.value for category in VideoCategoriesEnum}

def send_data_in_chunks(endpoint: str, data: dict, entity_name: str, chunk_size: int = 50) -> bool:
    """Send data to the backend API in smaller chunks with improved deduplication and error handling."""
    items = data[entity_name]
    total_items = len(items)
    success = True
    
    total_created = 0
    total_failed = 0
    processed_items = set()  # Set to track processed items by unique identifier
    
    print(f"\nSending {total_items} {entity_name} in chunks of {chunk_size}")
    
    for i in range(0, len(items), chunk_size):
        chunk = items[i:i + chunk_size]
        chunk_num = i//chunk_size + 1
        total_chunks = (len(items) + chunk_size - 1)//chunk_size
        print(f"\nSending chunk {chunk_num} of {total_chunks}")
        
        max_retries = 1
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                full_url = f'https://{base_host}{endpoint}'
                response = requests.post(
                    full_url,
                    json={entity_name: chunk},
                    verify=True,
                    timeout=30
                )
                response.raise_for_status()
                
                response_data = response.json()
                
                created_items = response_data.get(f'created_{entity_name}', [])
                failed_items = response_data.get(f'failed_{entity_name}', [])
                
                created_count = len(created_items)
                failed_count = len(failed_items)
                
                total_created += created_count
                total_failed += failed_count

                break
                
            except requests.exceptions.RequestException as e:
                retry_count += 1
                print(f"\nError sending chunk {chunk_num} (Attempt {retry_count}/{max_retries}): {str(e)}")
                if hasattr(e, 'response') and hasattr(e.response, 'text'):
                    print(f"Response content: {e.response.text}")
                
                if retry_count == max_retries:
                    print(f"Failed to send chunk {chunk_num} after {max_retries} attempts")
                    success = False
                else:
                    wait_time = 2 ** retry_count
                    print(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
        
        time.sleep(1)
    
    print(f"\nFinal Statistics for {entity_name}:")
    print(f"Total items processed: {len(processed_items)}")
    print(f"Successfully created: {total_created}")
    print(f"Failed: {total_failed}")
    
    return success and total_created > 0

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

    # Prepare and send data to backend
    teams_list, channels_list, videos_list = processor.prepare_data_for_api()

    # Send teams data
    teams_success = send_data_in_chunks(
        '/api/team-frontend/create-multiple-teams',
        {"teams": teams_list},
        'teams'
    )

    # Send channels data
    print("\nProceeding with channels...")
    channels_success = send_data_in_chunks(
        '/api/channel-frontend/create-multiple-channels',
        {"channels": channels_list},
        'channels'
    )

    # Send videos data in chunks
    print("\nProceeding with videos...")
    videos_success = send_data_in_chunks(
        '/api/video-frontend/create-multiple-videos',
        {"videos": videos_list},
        'videos',
        chunk_size=50  # Send 50 videos at a time
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
    if pd.isna(value) or (isinstance(value, float) and (math.isnan(value) or math.isinf(value))):
        return None
    return str(value) if value else None

print("\nAnalysis complete!") 