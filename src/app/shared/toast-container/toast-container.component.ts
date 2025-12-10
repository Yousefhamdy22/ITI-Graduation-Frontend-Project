import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent {
  toasts$: any;

  constructor(private toast: ToastService) {
    this.toasts$ = this.toast.toasts$;
  }

  dismiss(id: number) { this.toast.dismiss(id); }
}
