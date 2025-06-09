import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { SessionService } from '@frontend/user-data';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  private readonly sessionService: SessionService = inject(SessionService);
  private readonly router: Router = inject(Router);

  public async canActivate(): Promise<boolean> {
    const isLoggedIn = this.sessionService.isAuthenticated();

    if (isLoggedIn) {
      return true;
    }

    this.router.navigate(['/']);

    return false;
  }
}
