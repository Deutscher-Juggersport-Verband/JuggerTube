import { inject, Injectable } from '@angular/core';
import { SessionService, UserRoleEnum } from '@frontend/user-data';
import { combineLatest, filter, map, Observable, withLatestFrom } from 'rxjs';
import { UsersDataService } from './users.data-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private readonly sessionService = inject(SessionService);
  private readonly usersDataService = inject(UsersDataService);

  public readonly isAuthenticated$: Observable<boolean> = this.sessionService.token$.pipe(
    map((token) => !!token)
  );

  public readonly currentUser$ = this.usersDataService.currentUser$;

  public readonly canCreateVideo$: Observable<boolean> = this.hasRole([
    UserRoleEnum.ADMIN,
    UserRoleEnum.MODERATOR,
  ]);

  public hasRole(roles: UserRoleEnum[]): Observable<boolean> {
    return combineLatest([this.isAuthenticated$, this.currentUser$]).pipe(
      map(([isAuthenticated, user]) => {
        if (!isAuthenticated || !user) {
          return false;
        }
        return roles.includes(user.role);
      })
    );
  }

  public loadUserDataIfUserIsLoggedIn(): void {
    this.sessionService.token$
      .pipe(
        filter((token) => !!token),
        withLatestFrom(this.usersDataService.currentUser$),
        filter(([, user]) => !user),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.usersDataService.loadUserData(undefined);
      });
  }

  public logoutUser(): void {
    this.sessionService.clearSession();
    this.usersDataService.clearUserData();
  }
}
