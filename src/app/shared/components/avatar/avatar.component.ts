import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getAvatarClasses()">
      @if (src) {
        <img
          [src]="src"
          [alt]="alt"
          class="w-full h-full object-cover"
        />
      }
      @if (!src && initials) {
        <div
          class="w-full h-full flex items-center justify-center bg-primary-500 text-white font-medium"
        >
          {{ initials }}
        </div>
      }
      @if (!src && !initials) {
        <div
          class="w-full h-full flex items-center justify-center bg-neutral-300"
        >
          <svg class="w-1/2 h-1/2 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      }
      
      @if (status) {
        <span [class]="getStatusClasses()" [attr.aria-label]="statusLabel"></span>
      }
    </div>
  `,
  styles: []
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = 'Avatar';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() initials?: string;
  @Input() status?: 'online' | 'offline' | 'away';
  @Input() statusLabel?: string;

  getAvatarClasses(): string {
    const baseClasses = 'avatar relative';
    const sizeClasses = `avatar-${this.size}`;
    
    return `${baseClasses} ${sizeClasses}`.trim();
  }

  getStatusClasses(): string {
    const baseClasses = 'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white';
    let colorClasses = '';
    
    switch (this.status) {
      case 'online':
        colorClasses = 'bg-success-500';
        break;
      case 'offline':
        colorClasses = 'bg-neutral-400';
        break;
      case 'away':
        colorClasses = 'bg-warning-500';
        break;
    }
    
    return `${baseClasses} ${colorClasses}`.trim();
  }
}
