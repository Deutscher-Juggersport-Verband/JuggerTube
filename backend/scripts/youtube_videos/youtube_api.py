import os
import sys
from pathlib import Path

import requests
from googleapiclient.discovery import build
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from scripts.telegram_bot.send_messages.telegram_notifier import notify
from scripts.youtube_videos.api_client import send_videos_to_api
from scripts.youtube_videos.cache_manager import load_cache, save_cache
from scripts.youtube_videos.video_processor import process_video_data

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))


# Disable SSL verification warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

base_host = os.getenv('BASE_HOST', 'localhost:8080')

# Change URL depending on the environment
create_videos_url = f'https://{base_host}/api/video-frontend/create-multiple-videos'


def fetch_youtube_videos(youtube, channel_id, videos_cache):
    """Fetch videos from YouTube channel and process them"""
    # Get channel data including customUrl
    response = youtube.channels().list(
        part='contentDetails,snippet',
        id=channel_id
    ).execute()

    playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    channel_name = response['items'][0]['snippet'].get('title', '')

    # Fetch all videos from the playlist
    youtube_videos = []
    next_page_token = None

    while True:
        playlist_items_response = youtube.playlistItems().list(
            part='snippet',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        ).execute()

        for item in playlist_items_response['items']:
            video_id = item['snippet']['resourceId']['videoId']

            # Check cache
            if video_id in videos_cache:
                print(f"Using cached data for video {video_id}")
                youtube_videos.append(item)
                continue

            youtube_videos.append(item)
            videos_cache[video_id] = item

        next_page_token = playlist_items_response.get('nextPageToken')
        if not next_page_token:
            break

    return youtube_videos, channel_name


def process_youtube_videos(youtube_videos, channel_name):
    """Process YouTube videos and separate them into valid and other videos"""
    videos_data = []
    videos_other_naming = []

    for youtube_video in youtube_videos:
        video_data, is_valid = process_video_data(youtube_video, channel_name)

        if is_valid:
            videos_data.append(video_data)
        else:
            videos_other_naming.append({
                video_data['name'],
                video_data['videoLink']
            })

    return videos_data, videos_other_naming


def send_other_naming_notification(channel_name, videos_other_naming):
    """Send Telegram notification for unmatched videos"""
    if not videos_other_naming:
        return

    # Create message with all unmatched videos
    message_lines = [f"Channel: {channel_name}"]
    message_lines.append("Videos mit anderem Naming:")

    for video in videos_other_naming:
        # Extract video name and link from the set
        video_name = None
        video_link = None
        for item in video:
            if item.startswith('https://'):
                video_link = item
            else:
                video_name = item

        if video_name and video_link:
            message_lines.append(f"• {video_name}: {video_link}")

    message = "\n".join(message_lines)
    notify(f"Videos mit anderem Naming - {channel_name}", message)


def main(channel_id):
    # Load cached data
    videos_cache = load_cache()
    print(f"Loaded {len(videos_cache)} cached videos")

    # Initialize YouTube API
    api_key = 'AIzaSyCd4irgsASp6cb393tAgYBTXacjGq2YG3E'
    youtube = build('youtube', 'v3', developerKey=api_key)

    # Fetch videos from YouTube
    youtube_videos, channel_name = fetch_youtube_videos(youtube, channel_id, videos_cache)
    print(f"Fetched {len(youtube_videos)} videos from channel: {channel_name}")

    # Save updated cache
    save_cache(videos_cache)

    # Process videos
    videos_data, videos_other_naming = process_youtube_videos(
        youtube_videos, channel_name)
    print(
        f"Processed {
            len(videos_data)} valid videos and {
            len(videos_other_naming)} unmatched videos")

    # Send valid videos to API
    if videos_data:
        print(f"Sending {len(videos_data)} videos to API...")
        response = send_videos_to_api(videos_data)
    else:
        print("No valid videos to send to API")
        response = None

    # Send notification for unmatched videos
    send_other_naming_notification(channel_name, videos_other_naming)

    if response:
        if response.status_code == 200:
            notify("Videos wurden importiert")
        else:
            notify("Fehler beim Import", response.text)


if __name__ == "__main__":
    channel_ids = [
        'UCIp0Z0R5BNYoRTFG-1s5Y9g',
        'UC1EXd2J8aqwiKC64yvIMKGQ',
        'UCvdd5RoFdmzJhBTeesXZ6og'
    ]

    for channel in channel_ids:
        main(channel)
