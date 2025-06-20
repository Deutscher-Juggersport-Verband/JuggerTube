import { DestroyRef, inject, Injectable, Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  clearVideoCache,
  createVideo,
  loadNextVideos,
  loadPaginatedVideosAction,
  updateCurrentView,
} from '../store/actions/videos.actions';
import {
  VideosState,
  VideosStateAware,
} from '../store/models/videos-state.model';
import { paginatedVideosDataSelector } from '../store/selectors/paginated-videos-data.selector';
import { totalCountVideosDataSelector } from '../store/selectors/total-count-videos-data.selector';
import { videosRequestStateSelector } from '../store/selectors/videos-request-state.selector';
import { videosStateFeatureSelector } from '../store/selectors/videos-state-feature.selector';
import { getDisplayedVideoIndices, isRangeCached } from '../utils/range-utils';
import { RequestStateEnum } from '@frontend/api';
import { SingletonGetter } from '@frontend/cache';
import {
  CreateVideoRequest,
  VideoApiResponseModel,
  VideoFilterOptions,
} from '@frontend/video-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class VideosDataService {
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);

  @SingletonGetter()
  public get paginatedVideos(): Signal<VideoApiResponseModel[]> {
    return this.store$.selectSignal(paginatedVideosDataSelector);
  }

  @SingletonGetter()
  public get totalCountVideos(): Signal<number> {
    return this.store$.selectSignal(totalCountVideosDataSelector);
  }

  @SingletonGetter()
  public get videoRequestState$(): Observable<RequestStateEnum> {
    return this.store$.select(videosRequestStateSelector);
  }

  private readonly store$: Store<VideosStateAware> = inject(Store);

  public loadPaginatedVideos(
    start: number,
    limit: number,
    filters?: VideoFilterOptions
  ): void {
    this.store$.dispatch(loadPaginatedVideosAction({ start, limit, filters }));
  }

  public loadNextVideos(
    start: number,
    limit: number,
    filters?: VideoFilterOptions
  ): void {
    this.store$.dispatch(loadNextVideos({ start, limit, filters }));
  }

  public updateCurrentView(start: number, limit: number): void {
    const displayedVideos = getDisplayedVideoIndices(start, limit);
    this.store$.dispatch(updateCurrentView({ start, limit, displayedVideos }));
  }

  public isRangeCached(
    start: number,
    limit: number,
    filters?: VideoFilterOptions
  ): boolean {
    if (filters && Object.keys(filters).length > 0) {
      return false;
    }

    let loadedRanges: VideosState['loadedRanges'] = [];
    this.store$
      .select(videosStateFeatureSelector)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((state) => (loadedRanges = state.loadedRanges))
      .unsubscribe();
    return isRangeCached(start, limit, loadedRanges);
  }

  public getVideoById(id: number): VideoApiResponseModel | undefined {
    return this.paginatedVideos().find((video) => video.id === id);
  }

  public create(videoData: CreateVideoRequest): void {
    this.store$.dispatch(createVideo({ videoData }));
  }

  public clearVideoCache(): void {
    this.store$.dispatch(clearVideoCache());
  }
}
