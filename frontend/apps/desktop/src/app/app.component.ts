import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UiToastContainerComponent } from './components/ui-toast-container/ui-toast-container.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { InfoBarComponent } from './info-bar/info-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderBarComponent,
    InfoBarComponent,
    UiToastContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {}
