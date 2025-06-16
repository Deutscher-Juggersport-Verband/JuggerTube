import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserApiClient } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class PrivilegedGuard implements CanActivate {
  private readonly userApiClient: UserApiClient = inject(UserApiClient);
  private readonly router: Router = inject(Router);

  public async canActivate(): Promise<boolean> {
    const isPrivileged = await this.userApiClient.isPrivileged();

    if (isPrivileged) {
      return true;
    }

    this.router.navigate(['/']);

    return false;
  }
}
