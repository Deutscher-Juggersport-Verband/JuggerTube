import { HttpErrorResponse } from '@angular/common/http';

import { RequestStateEnum } from '@frontend/api';
import { VideoApiResponseModel } from '@frontend/video-data';

export const videosFeatureKey = 'videoOverview';

export interface LoadedRange {
  start: number;
  end: number;
}

export interface CurrentView {
  start: number;
  limit: number;
  displayedVideos: number[];
}

export interface VideosState {
  allVideos: { [key: number]: VideoApiResponseModel };
  loadedRanges: LoadedRange[];
  requestState: RequestStateEnum;
  error: HttpErrorResponse | null;
  count: number;
  currentView: CurrentView;
}

export interface VideosStateAware {
  [videosFeatureKey]: VideosState;
}

export const initialState: VideosState = {
  allVideos: {},
  loadedRanges: [],
  requestState: RequestStateEnum.Initial,
  count: 0,
  error: null,
  currentView: {
    start: 0,
    limit: 20,
    displayedVideos: [],
  },
};
