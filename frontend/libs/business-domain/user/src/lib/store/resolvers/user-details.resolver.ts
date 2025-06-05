import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { first, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { loadUserDetailsDataAction } from '../actions/user-details.action';
import { userDetailsSelector } from '../selectors/user-details.selector';
import { SessionService } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsResolver implements Resolve<boolean> {
  private readonly store$: Store = inject(Store);
  private readonly sessionService: SessionService = inject(SessionService);

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const escapedUsername = route.paramMap.get('escapedUsername') ?? undefined;

    if (!escapedUsername && !this.sessionService.isAuthenticated()) {
      return new Observable<boolean>((observer) => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.store$.select(userDetailsSelector).pipe(
      first(),
      switchMap((userDetails) => {
        if (!userDetails) {
          this.store$.dispatch(
            loadUserDetailsDataAction({
              escapedUsername: escapedUsername ?? undefined,
            })
          );
        }
        return of(true);
      })
    );
  }
}
