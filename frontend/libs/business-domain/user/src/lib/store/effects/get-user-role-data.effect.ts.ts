import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadUserRoleAction,
  loadUserRoleActionFailed,
  loadUserRoleActionSuccess
} from '../actions/user-details.action';
import { UserDataClient, UserRoleEnum } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class GetUserRoleEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);


  public getUserRoleData$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserRoleAction),
      switchMap(() => {
        return this.userDataClient.isAdmin$().pipe(
          withLatestFrom(this.userDataClient.isPrivileged$()),
          switchMap(([isAdmin, isPrivileged]) => {
            return of([isAdmin, isPrivileged]).pipe(
              map(() => {
                const userRole = isAdmin ? UserRoleEnum.ADMIN : isPrivileged ? UserRoleEnum.MODERATOR : UserRoleEnum.USER;
                return loadUserRoleActionSuccess({ userRole });
              }),
              catchError((error) => {
                if (error.status !== 200 && error.error) {
                  return of(loadUserRoleActionFailed({ error: error.error }));
                }
                throw error;
              })
            );
          }),
        );
      })
    )
  );
}

