import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import {
  loadPaginatedVideosAction,
  loadPaginatedVideosActionError,
  loadPaginatedVideosActionSuccess,
} from '../actions/videos.actions';
import {
  PaginatedVideosApiResponseModel,
  VideoApiResponseModel,
  VideosApiClient,
} from '@frontend/video-data';

const unknownError = { form: 'Unknown error' };

@Injectable()
export class LoadPaginatedVideosEffects {
  private readonly actions$ = inject(Actions);
  private readonly videosApiClient = inject(VideosApiClient);

  public readonly loadPaginatedVideos: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPaginatedVideosAction),
      exhaustMap((action: ReturnType<typeof loadPaginatedVideosAction>) =>
        this.videosApiClient
          .getPaginatedVideos$(action.start, action.limit, action.filters)
          .pipe(
            map((data: PaginatedVideosApiResponseModel) => {
              console.log('data', data);
              const convertedVideos = data.results.map((video) => this.convertDatesInVideo(video));
              console.log('convertedVideos', convertedVideos);
              return loadPaginatedVideosActionSuccess({
                videos: convertedVideos,
                count: data.count,
              });
            }),
            catchError((response: HttpErrorResponse) => {
              return of(
                loadPaginatedVideosActionError({
                  error:
                    response.status === 422 ? response.error : unknownError,
                })
              );
            })
          )
      )
    )
  );

  private convertStringToDate(dateStr: string): Date {
    if (!dateStr) { 
      return new Date('1990-01-01T00:00:00') 
    };
  
    // Handle ISO format (2010-07-10T00:00:00)
    if (dateStr.includes('T')) {
      return new Date(dateStr);
    }

    // DD-MM-YYYY format
    const [day, month, year] = dateStr.split('-').map((num) => parseInt(num, 10));
    return new Date(year, month - 1, day);
  }

  private convertDatesInVideo(video: VideoApiResponseModel): VideoApiResponseModel {
    const uploadDateStr = video.uploadDate as unknown as string;
    const uploadDate = this.convertStringToDate(uploadDateStr);
    const dateOfRecording =
      video.dateOfRecording == null ? null : this.convertStringToDate(video.dateOfRecording as unknown as string);

    const startDate =
      video.tournament?.startDate ? this.convertStringToDate(video.tournament.startDate as unknown as string) : uploadDate;
    const endDate =
      video.tournament?.endDate ? this.convertStringToDate(video.tournament.endDate as unknown as string) : startDate;

    return {
      ...video,
      uploadDate,
      dateOfRecording,
      tournament: video.tournament
        ? { ...video.tournament, startDate, endDate }
        : video.tournament,
    };
  }
}
