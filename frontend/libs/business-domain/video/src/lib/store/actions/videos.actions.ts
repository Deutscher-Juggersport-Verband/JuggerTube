import { HttpErrorResponse } from '@angular/common/http';

import { createAction, props } from '@ngrx/store';

import { LoadedRange } from '../models/videos-state.model';
import {
  CreateVideoRequest,
  VideoApiResponseModel,
  VideoFilterOptions
} from '@frontend/video-data';

export enum VideosActionNamesEnum {
  LoadPaginatedVideos = '[Videos] Load Paginated Videos',
  LoadPaginatedVideosSuccess = '[Videos] Load Paginated Videos Success',
  LoadPaginatedVideosError = '[Videos] Load Paginated Videos Error',
  LoadNextVideos = '[Videos] Load Next Videos',
  LoadNextVideosSuccess = '[Videos] Load Next Videos Success',
  LoadNextVideosError = '[Videos] Load Next Videos Error',
  MergeVideoRanges = '[Videos] Merge Video Ranges',
  UpdateCurrentView = '[Videos] Update Current View',
  CacheVideos = '[Videos] Cache Videos',
  RequestVideoRange = '[Videos] Request Video Range',
  CreateVideo = '[Videos] Create Video',
  CreateVideoSuccess = '[Videos] Create Video Success',
  CreateVideoFailure = '[Videos] Create Video Failure',
  ClearVideoCache = '[Videos] Clear Video Cache',
}

export const loadPaginatedVideosAction = createAction(
  VideosActionNamesEnum.LoadPaginatedVideos,
  props<{
    start: number;
    limit: number;
    filters?: VideoFilterOptions;
  }>()
);

export const loadPaginatedVideosActionSuccess = createAction(
  VideosActionNamesEnum.LoadPaginatedVideosSuccess,
  props<{
    videos: VideoApiResponseModel[];
    count: number;
  }>()
);

export const loadPaginatedVideosActionError = createAction(
  VideosActionNamesEnum.LoadPaginatedVideosError,
  props<{
    error: HttpErrorResponse;
  }>()
);

export const loadNextVideos = createAction(
  VideosActionNamesEnum.LoadNextVideos,
  props<{
    start: number;
    limit: number;
    filters?: VideoFilterOptions;
  }>()
);

export const loadNextVideosSuccess = createAction(
  VideosActionNamesEnum.LoadNextVideosSuccess,
  props<{
    videos: VideoApiResponseModel[];
    count: number;
  }>()
);

export const loadNextVideosError = createAction(
  VideosActionNamesEnum.LoadNextVideosError,
  props<{
    error: HttpErrorResponse;
  }>()
);

export const mergeVideoRanges = createAction(
  VideosActionNamesEnum.MergeVideoRanges,
  props<{
    ranges: LoadedRange[];
  }>()
);

export const updateCurrentView = createAction(
  VideosActionNamesEnum.UpdateCurrentView,
  props<{
    start: number;
    limit: number;
    displayedVideos: number[];
  }>()
);

export const cacheVideos = createAction(
  VideosActionNamesEnum.CacheVideos,
  props<{
    videos: VideoApiResponseModel[];
    range: LoadedRange;
  }>()
);

export const requestVideoRange = createAction(
  VideosActionNamesEnum.RequestVideoRange,
  props<{
    start: number;
    limit: number;
  }>()
);

export const createVideo = createAction(
  VideosActionNamesEnum.CreateVideo,
  props<{ videoData: CreateVideoRequest }>()
);

export const createVideoSuccess = createAction(
  VideosActionNamesEnum.CreateVideoSuccess,
  props<{ response: { id: number; message: string } }>()
);

export const createVideoFailure = createAction(
  VideosActionNamesEnum.CreateVideoFailure,
  props<{ error: string }>()
);

export const clearVideoCache = createAction(
  VideosActionNamesEnum.ClearVideoCache
);
