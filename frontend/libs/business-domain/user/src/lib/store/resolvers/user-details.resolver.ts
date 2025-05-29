import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { loadUserDetailsDataAction } from '../actions/user-details.action';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsResolver implements Resolve<boolean> {
  private readonly store$: Store = inject(Store);

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const escapedUsername = route.paramMap.get('escapedUsername');

    this.store$.dispatch(
      loadUserDetailsDataAction({
        escapedUsername: escapedUsername ?? undefined,
      })
    );

    return new Observable<boolean>((observer) => {
      observer.next(true);
      observer.complete();
    });
  }
}
