import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderBarComponent } from './header-bar/header-bar.component';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { UiToastContainerComponent } from './ui-shared';
import { UserContextService } from '@frontend/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderBarComponent,
    InfoBarComponent,
    UiToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  private readonly userContextService: UserContextService = inject(UserContextService);

  constructor() {
    this.userContextService.loadUserDataIfUserIsLoggedIn();
  }
}
