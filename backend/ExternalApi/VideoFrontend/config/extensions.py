from config import cache


def clear_video_overview_cache() -> None:

    cache.delete('video-overview')
    cache.delete('paginated-videos-overview')
