import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '@core/models/common.model';

export interface Toast {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSignal = signal<Toast[]>([]);
  
  toasts = this.toastsSignal.asReadonly();

  show(message: string, type: NotificationType = 'info', duration: number = 3000): void {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    this.toastsSignal.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toastsSignal.set([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
