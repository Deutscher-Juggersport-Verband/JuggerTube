import { createReducer, on } from '@ngrx/store';

import {
  getDisplayedVideoIndices,
  videosToDict,
} from '../../utils/range-utils';
import {
  clearVideoCache,
  loadPaginatedVideosAction,
  loadPaginatedVideosActionError,
  loadPaginatedVideosActionSuccess,
} from '../actions/videos.actions';
import { initialState, VideosState } from '../models/videos-state.model';
import { RequestStateEnum } from '@frontend/api';

export const videosReducer = createReducer(
  initialState,
  on(clearVideoCache, (state: VideosState): VideosState => {
    return {
      ...initialState,
      requestState: state.requestState,
    };
  }),
  on(
    loadPaginatedVideosAction,
    (state: VideosState, { start, limit }): VideosState => {
      return {
        ...state,
        currentView: {
          start,
          limit,
          displayedVideos: getDisplayedVideoIndices(start, limit),
        },
        requestState: RequestStateEnum.Pending,
        error: null,
      };
    }
  ),
  on(
    loadPaginatedVideosActionSuccess,
    (state: VideosState, action): VideosState => {
      return {
        ...state,
        allVideos: videosToDict(action.videos, state.currentView.start),
        loadedRanges: [
          {
            start: state.currentView.start, 
            end: state.currentView.start + action.videos.length - 1
          }
        ],
        count: action.count,
        requestState: RequestStateEnum.Success,
      };
    }
  ),
  on(
    loadPaginatedVideosActionError,
    (state: VideosState, { error }): VideosState => {
      return {
        ...state,
        requestState: RequestStateEnum.Error,
        error: error,
      };
    }
  ),
);
