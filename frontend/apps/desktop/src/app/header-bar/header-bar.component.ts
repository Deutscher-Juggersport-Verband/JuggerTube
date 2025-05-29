import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SessionService } from '@frontend/user-data';

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
}
