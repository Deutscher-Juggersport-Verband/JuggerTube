import os
from googleapiclient.discovery import build
from cache_manager import load_cache, save_cache
from video_processor import process_video_data
from api_client import send_videos_to_api
from error_logger import log_video_error, load_error_log
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from telegram_bot.telegram_notifier import notify

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

            # Add channel custom URL to each video item
            item['snippet']['title'] = channel_name

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

    return youtube_videos


def process_youtube_videos(youtube_videos):
    """Process YouTube videos and separate them into valid and other videos"""
    videos_data = []
    videos_other_naming = []

    for youtube_video in youtube_videos:
        video_data, is_valid = process_video_data(youtube_video)

        if is_valid:
            videos_data.append(video_data)
        else:
            videos_other_naming.append({
                video_data['name'],
                video_data['videoLink']
            })

    return videos_data, videos_other_naming


def save_other_naming(channel_id, videos_other_naming):
    """Save unmatched videos to a file"""
    with open(f"{channel_id}OtherNaming.txt", "w", encoding="utf-8") as out_file:
        for video in videos_other_naming:
            line = f"{video}\n"
            out_file.write(line)


def main(channel_id):
    # Load cached data
    videos_cache = load_cache()

    # Initialize YouTube API
    api_key = 'AIzaSyCd4irgsASp6cb393tAgYBTXacjGq2YG3E'
    youtube = build('youtube', 'v3', developerKey=api_key)

    # Fetch videos from YouTube
    youtube_videos = fetch_youtube_videos(youtube, channel_id, videos_cache)

    # Save updated cache
    save_cache(videos_cache)

    # Process videos
    videos_data, videos_other_naming = process_youtube_videos(youtube_videos)

    # Send valid videos to API
    response = send_videos_to_api(videos_data)

    # Save unmatched videos
    save_other_naming(channel_id, videos_other_naming)

    # Send status message
    error_log = load_error_log()
    if response.status_code == 200 or not error_log:
        notify("Videos wurden importiert")
    else:
        error_message = "\n".join(
            [f"{entry['videoName']}: {entry['errorMessage']}" for entry in error_log])
        notify("Fehler beim Import", error_message)


if __name__ == "__main__":
    channel_ids = [
        'UCIp0Z0R5BNYoRTFG-1s5Y9g',
        'UC1EXd2J8aqwiKC64yvIMKGQ',
        'UCvdd5RoFdmzJhBTeesXZ6og'
    ]

    for channel in channel_ids:
        main(channel)
