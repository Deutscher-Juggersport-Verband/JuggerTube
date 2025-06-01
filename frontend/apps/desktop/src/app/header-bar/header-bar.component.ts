import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { SingletonGetter } from '@frontend/cache';
import { userDetailsSelector } from '@frontend/user';
import { SessionService, User } from '@frontend/user-data';

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
