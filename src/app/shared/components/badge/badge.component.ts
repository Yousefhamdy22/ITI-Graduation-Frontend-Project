import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: []
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() rounded = true;

  getBadgeClasses(): string {
    const baseClasses = 'badge';
    const variantClasses = `badge-${this.variant}`;
    const shapeClasses = this.rounded ? '' : 'rounded-md';
    
    return `${baseClasses} ${variantClasses} ${shapeClasses}`.trim();
  }
}
