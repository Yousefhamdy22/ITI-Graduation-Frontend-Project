import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!inline) {
      <div class="flex items-center justify-center min-h-[200px]">
        <div [class]="getLoaderClasses()"></div>
      </div>
    }
    @if (inline) {
      <div [class]="getLoaderClasses()"></div>
    }
  `,
  styles: []
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() inline = false;

  getLoaderClasses(): string {
    const baseClasses = 'loader';
    let sizeClasses = '';
    
    switch (this.size) {
      case 'sm':
        sizeClasses = 'h-4 w-4';
        break;
      case 'lg':
        sizeClasses = 'h-8 w-8';
        break;
      default:
        sizeClasses = 'h-5 w-5';
    }
    
    return `${baseClasses} ${sizeClasses}`.trim();
  }
}
