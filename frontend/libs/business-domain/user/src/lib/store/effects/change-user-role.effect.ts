import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  changeUserRoleAction,
  changeUserRoleActionFailed,
  changeUserRoleActionSuccess,
} from '../actions/user-details.action';
import { UserDataClient } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class ChangeUserRoleEffect {
  private readonly actions$: Actions = inject(Actions);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);

  public changeUserRole$: Observable<unknown> = createEffect(() =>
    this.actions$.pipe(
      ofType(changeUserRoleAction),
      switchMap((action) => {
        return this.userDataClient.updateUserRole$(action.userId, action.userRole).pipe(
            map(() => changeUserRoleActionSuccess()),
            catchError((error) => of(changeUserRoleActionFailed({ error })))
        );
      }
      )
    )
  );
}