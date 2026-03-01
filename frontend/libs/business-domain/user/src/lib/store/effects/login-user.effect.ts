import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadUserDetailsDataAction,
  loginUserAction,
  loginUserActionFailed,
  loginUserActionSuccess
} from '../actions/user-details.action';
import { AuthResponse, LoginRequestBody, SessionService, UserDataClient } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class LoginUserEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly store: Store = inject(Store);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);
  private readonly sessionService = inject(SessionService);

  public loginUser$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserAction),
      switchMap((action) => {
        const loginRequestBody: LoginRequestBody = {
            email: action.email ?? null,
            password: action.password ?? null,
        };
        return this.userDataClient.loginUser$(loginRequestBody).pipe(
            map((response: AuthResponse) => { 
              if (response.token) {
                this.sessionService.setSession(response.token);
              };
              this.store.dispatch(loadUserDetailsDataAction({escapedUsername: undefined}));
              return loginUserActionSuccess()
            }),
            catchError((error) => { 
              if (error.status !== 200 && error.error) {
                return of(loginUserActionFailed({ error }))
              }
              throw error;
            })
        );
      })
    )
  );
}