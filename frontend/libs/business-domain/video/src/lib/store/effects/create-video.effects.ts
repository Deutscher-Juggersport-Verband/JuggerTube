import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { createVideo, createVideoFailure,createVideoSuccess } from '../actions/videos.actions';
import { ToastService } from '@frontend/video';
import { VideosApiClient } from '@frontend/video-data';

@Injectable()
export class CreateVideoEffects {
  private readonly actions$ = inject(Actions);
  private readonly videosApiClient = inject(VideosApiClient);
  private readonly toastService = inject(ToastService);

  public readonly createVideo: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(createVideo),
      mergeMap(({ videoData }) => {
        return this.videosApiClient.create(videoData).pipe(
          map((response) => {
            this.toastService.showSuccess('Video wurde erfolgreich erstellt.');
            return createVideoSuccess({ response });
          }),
          catchError((error) => {
            this.toastService.showError('Fehler beim Erstellen des Videos.');
            return of(createVideoFailure({ error }));
          })
        );
      })
    )
  );
}
