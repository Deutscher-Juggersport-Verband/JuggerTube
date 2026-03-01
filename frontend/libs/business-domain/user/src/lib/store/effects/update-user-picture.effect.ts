import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadUserDetailsDataAction,
  updateUserPictureAction,
  updateUserPictureActionFailed,
  updateUserPictureActionSuccess
} from '../actions/user-details.action';
import { UserDataClient } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserProfilePictureEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly store: Store = inject(Store);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);

  public updateUserProfilePicture$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPictureAction),
      switchMap((action) => {
        return this.userDataClient.updatePicture$(action.file).pipe(
            map(() => {
              this.store.dispatch(loadUserDetailsDataAction({escapedUsername: undefined}));
              return updateUserPictureActionSuccess()
            }),
            catchError((error) => { 
              if (error.status !== 200 && error.error) {
                return of(updateUserPictureActionFailed({ error }))
              }
              throw error;
            })
        );
      })
    )
  );
}