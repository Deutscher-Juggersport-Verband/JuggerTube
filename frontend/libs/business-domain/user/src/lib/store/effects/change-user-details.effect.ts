import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
    changeUserDetailsAction,
  changeUserDetailsActionFailed,
  changeUserDetailsActionSuccess,
  loadUserDetailsDataAction
} from '../actions/user-details.action';
import { SessionService, UpdateResponse, UserDataClient } from '@frontend/user-data';
import { userDetailsSelector } from '../selectors/user-details.selector';

@Injectable({
  providedIn: 'root',
})
export class ChangeUserDetailsEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly store: Store = inject(Store);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);
  private readonly sessionService = inject(SessionService);


  public changeUserDetails$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(changeUserDetailsAction),
      withLatestFrom(this.store.select(userDetailsSelector)),
      switchMap(([action, userDetails]) => {
        const updateRequestBody = {
            email: action.mail ?? null,
            name: userDetails?.name ?? null,
            password: action.password ?? null,
            username: userDetails?.username ?? null
        };
        return this.userDataClient.updateUser(updateRequestBody).pipe(
            map((response: UpdateResponse) => {
              if (response.token) {
                this.sessionService.setSession(response.token);
              };
              this.store.dispatch(loadUserDetailsDataAction({escapedUsername: undefined}));
              return changeUserDetailsActionSuccess();
            }),
            catchError((error) => {
              if (error.status !== 200 && error.error) {
                return of(changeUserDetailsActionFailed({ error: error.error }));
              }
              throw error;
            })
        );
      }
      )
    )
  );
}

