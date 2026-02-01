import { inject, Injectable, Signal } from '@angular/core';
import { User } from '@frontend/user-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userDetailsSelector } from '../store/selectors/user-details.selector';
import { SingletonGetter } from '@frontend/cache';
import { clearUserDetailsAction, loadUserDetailsDataAction } from '@frontend/user';

@Injectable({ providedIn: 'root' })
export class UsersDataService {
  private readonly store$: Store = inject(Store);

  @SingletonGetter()
  public get currentUser$(): Observable<User | null> {
    return this.store$.select(userDetailsSelector);
  }

  public loadUserData(escapedUsername: string | undefined): void {
    this.store$.dispatch(loadUserDetailsDataAction({escapedUsername}));
  }

  public clearUserData(): void {
    this.store$.dispatch(clearUserDetailsAction());
  }
}
