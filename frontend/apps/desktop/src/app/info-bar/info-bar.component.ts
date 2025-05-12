import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'info-bar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './info-bar.component.html',
  styleUrl: './info-bar.component.less',
})
export class InfoBarComponent {}
