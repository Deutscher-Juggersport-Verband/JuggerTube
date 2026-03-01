import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadUserDetailsDataAction,
  loadUserDetailsDataActionFailed,
  loadUserDetailsDataActionSuccess,
} from '../actions/user-details.action';
import { SessionService, User, UserDataClient } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);
  private readonly sessionService = inject(SessionService);

  public deleteUser$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserDetailsDataAction),
      switchMap((action) =>
        this.userDataClient.getUserData$(action.escapedUsername).pipe(
          map((payload: User) => {
            this.sessionService.clearSession();
            return loadUserDetailsDataActionSuccess({
              userDetails: payload,
            })
          }),
          catchError((error) => of(loadUserDetailsDataActionFailed({ error })))
        )
      )
    )
  );
}
