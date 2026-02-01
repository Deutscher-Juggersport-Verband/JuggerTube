import { inject, Injectable, Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  clearVideoCache,
  createVideo,
  loadPaginatedVideosAction,
} from '../store/actions/videos.actions';
import {
  VideosStateAware,
} from '../store/models/videos-state.model';
import { paginatedVideosDataSelector } from '../store/selectors/paginated-videos-data.selector';
import { totalCountVideosDataSelector } from '../store/selectors/total-count-videos-data.selector';
import { videosRequestStateSelector } from '../store/selectors/videos-request-state.selector';
import { RequestStateEnum } from '@frontend/api';
import { SingletonGetter } from '@frontend/cache';
import {
  CreateVideoRequestModel,
  VideoApiResponseModel,
  VideoFilterOptions,
} from '@frontend/video-data';

@Injectable({ providedIn: 'root' })
export class VideosDataService {
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

  public getVideoById(id: number): VideoApiResponseModel | undefined {
    return this.paginatedVideos().find((video) => video.id === id);
  }

  public create(videoData: CreateVideoRequestModel): void {
    const strippedVideoData = Object.fromEntries(Object.entries(videoData).filter(([, value]) => value));
    this.store$.dispatch(createVideo({ videoData: strippedVideoData as CreateVideoRequestModel}));
  }

  public clearVideoCache(): void {
    this.store$.dispatch(clearVideoCache());
  }
}
