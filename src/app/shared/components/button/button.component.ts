import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      [attr.aria-label]="ariaLabel"
    >
      @if (loading) {
        <span class="loader mr-2"></span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;

  getButtonClasses(): string {
    const baseClasses = 'btn';
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const widthClasses = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses}`.trim();
  }

  private getVariantClasses(): string {
    switch (this.variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'outline': return 'btn-outline';
      case 'ghost': return 'btn-ghost';
      case 'danger': return 'bg-danger-600 text-white hover:bg-danger-700';
      default: return 'btn-primary';
    }
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  }
}
