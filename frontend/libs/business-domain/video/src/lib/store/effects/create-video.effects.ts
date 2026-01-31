import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import {
  createVideo,
  createVideoFailure,
  createVideoSuccess,
} from '../actions/videos.actions';
import { ToastService, VideoCreationErrorMessagesConstants, VideoFormService } from '@frontend/video';
import { VideoCreationErrorTypesEnum, VideosApiClient } from '@frontend/video-data';

@Injectable()
export class CreateVideoEffects {
  private readonly actions$ = inject(Actions);
  private readonly videosApiClient = inject(VideosApiClient);
  private readonly toastService = inject(ToastService);
  private readonly videoFormService = inject(VideoFormService);

  public readonly createVideo: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(createVideo),
      mergeMap(({ videoData }) => {
        return this.videosApiClient.create(videoData).pipe(
          map((response) => {
            this.toastService.showSuccess('Video wurde erfolgreich erstellt.');
            this.videoFormService.create().reset();
            return createVideoSuccess({ response });
          }),
          catchError((error) => {
            switch (error?.error) {
              case 'Video with this name already exists':
                this.toastService.showError(VideoCreationErrorMessagesConstants.nameAlreadyExists);
                break;
              case 'Video with this link already exists':
                this.toastService.showError(VideoCreationErrorMessagesConstants.linkAlreadyExists);
                break;
              default:
                this.toastService.showError(VideoCreationErrorMessagesConstants.default);
            }
            return of(createVideoFailure({ error }));
          })
        );
      })
    )
  );
}
