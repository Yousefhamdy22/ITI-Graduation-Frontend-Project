import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast { id: number; message: string; type?: 'success'|'info'|'error'|'warning'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private sub = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.sub.asObservable();
  private seq = 1;

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const t: Toast = { id: this.seq++, message, type };
    const current = this.sub.value;
    this.sub.next([t, ...current]);
    if (duration > 0) setTimeout(() => this.dismiss(t.id), duration);
  }

  dismiss(id: number) {
    this.sub.next(this.sub.value.filter(t => t.id !== id));
  }
}
