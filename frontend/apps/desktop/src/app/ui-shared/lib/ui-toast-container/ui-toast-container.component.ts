import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { UiToastComponent } from '../ui-toast/ui-toast.component';
import { ToastService } from '@frontend/video';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [CommonModule, UiToastComponent],
  templateUrl: './ui-toast-container.component.html',
  styleUrls: ['./ui-toast-container.component.less'],
})
export class UiToastContainerComponent {
  public toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }
}
