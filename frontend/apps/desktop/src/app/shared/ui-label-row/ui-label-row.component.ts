import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { UiInfoButtonComponent } from '../ui-info-button/ui-info-button.component';

@Component({
  selector: 'ui-label-row',
  imports: [CommonModule, UiInfoButtonComponent],
  standalone: true,
  templateUrl: './ui-label-row.component.html',
  styleUrl: './ui-label-row.component.less',
})
export class UiLabelRowComponent {
  @Input() public labelText!: string;
  @Input() public infoButtonHeadline?: string;
  @Input() public infoButtonContent?: string;
  @Input() public flexibleLabel: boolean = false;
}
