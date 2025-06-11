import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

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
  private readonly toastService: ToastService = inject(ToastService);
  public toasts$ = this.toastService.toasts$;
}
