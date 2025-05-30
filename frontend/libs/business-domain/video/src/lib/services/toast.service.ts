import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toasts.asObservable();
  private nextId = 0;

  public showSuccess(message: string): void {
    this.show({ message, type: 'success' });
  }

  public showError(message: string): void {
    this.show({ message, type: 'error' });
  }

  private show(toast: Omit<Toast, 'id'>): void {
    const id = this.nextId++;
    this.toasts.next([...this.toasts.value, { ...toast, id }]);
    setTimeout(() => this.remove(id), 5000);
  }

  public remove(id: number): void {
    this.toasts.next(this.toasts.value.filter((t) => t.id !== id));
  }
}
