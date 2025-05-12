import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'info-bar',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './info-bar.component.html',
  styleUrl: './info-bar.component.less',
})
export class InfoBarComponent {}
