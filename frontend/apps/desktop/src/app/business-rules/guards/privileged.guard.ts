import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanActivate, Router } from '@angular/router';
import { UserRoleEnum } from '@frontend/user-data';
import { UsersDataService } from 'libs/business-domain/user/src/lib/services/users.data-service';

@Injectable({
  providedIn: 'root',
})
export class PrivilegedGuard implements CanActivate {
  private readonly router: Router = inject(Router);
  private readonly usersDataService = inject(UsersDataService);
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);

  public async canActivate(): Promise<boolean> {
    const isPrivileged = this.usersDataService.currentUser$.pipe(
      takeUntilDestroyed(this.destroyRef$)
    ).subscribe((user) => {
      return user?.role === UserRoleEnum.MODERATOR;
    });

    if (isPrivileged) {
      return true;
    }

    this.router.navigate(['/']);

    return false;
  }
}
