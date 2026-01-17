
import { Component, Input } from '@angular/core';

import { Toast } from '@frontend/video';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [],
  templateUrl: './ui-toast.component.html',
  styleUrls: ['./ui-toast.component.less'],
})
export class UiToastComponent {
  @Input() public toast!: Toast;
}
