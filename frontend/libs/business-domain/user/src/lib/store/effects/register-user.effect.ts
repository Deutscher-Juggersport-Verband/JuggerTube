import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadUserDetailsDataAction,
  registerUserAction,
  registerUserActionFailed,
  registerUserActionSuccess
} from '../actions/user-details.action';
import { AuthResponse, RegisterRequestBody, SessionService, UserDataClient } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly store: Store = inject(Store);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);
  private readonly sessionService = inject(SessionService);

  public registerUser$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUserAction),
      switchMap((action) => {
        const registerRequestBody: RegisterRequestBody = {
            email: action.email ?? null,
            password: action.password ?? null,
            name: action.name ?? null,
            username: action.username ?? null,
        };
        return this.userDataClient.registerUser$(registerRequestBody).pipe(
            map((response: AuthResponse) => { 
              if (response.token) {
                this.sessionService.setSession(response.token);
              };
              this.store.dispatch(loadUserDetailsDataAction({escapedUsername: undefined}));
              return registerUserActionSuccess()
            }),
            catchError((error) => { 
              if (error.status !== 200 && error.error) {
                return of(registerUserActionFailed({ error }))
              }
              throw error;
            })
        );
      })
    )
  );
}