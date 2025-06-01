import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { SessionService, User, UserApiClient } from '@frontend/user-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userDetailsSelector } from '@frontend/user';
import { SingletonGetter } from '@frontend/cache';

@Component({
  selector: 'header-bar',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.less',
})
export class HeaderBarComponent {
  private readonly sessionService: SessionService = inject(SessionService);
  protected isAuthenticated$ = this.sessionService.token$;
  protected logout = this.sessionService.clearSession.bind(this.sessionService);
  private readonly store$: Store = inject(Store);

  @SingletonGetter()
  public get currentUser$(): Observable<User | null> {
    return this.store$.select(userDetailsSelector);
  }
}
