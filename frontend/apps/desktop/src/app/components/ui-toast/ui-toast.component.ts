import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Toast } from '@frontend/video';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-toast.component.html',
  styleUrls: ['./ui-toast.component.less']
})
export class UiToastComponent {
  @Input() toast!: Toast;
}
