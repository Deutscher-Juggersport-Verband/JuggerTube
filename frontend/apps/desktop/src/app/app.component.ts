import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderBarComponent } from './header-bar/header-bar.component';
import {InfoBarComponent} from './info-bar/info-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderBarComponent, InfoBarComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {}
