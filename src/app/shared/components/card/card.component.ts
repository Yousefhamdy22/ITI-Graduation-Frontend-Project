import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      @if (header) {
        <div class="px-6 py-4 border-b border-neutral-200">
          <h3 class="text-lg font-semibold text-neutral-900">{{ header }}</h3>
        </div>
      }
      
      <div [class]="getBodyClasses()">
        <ng-content></ng-content>
      </div>
      
      @if (footer) {
        <div class="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <ng-content select="[footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() header?: string;
  @Input() footer = false;
  @Input() hoverable = false;
  @Input() hover = false; // Alias for hoverable
  @Input() padding = true;

  getCardClasses(): string {
    const baseClasses = 'card';
    const hoverClasses = (this.hoverable || this.hover) ? 'card-hover cursor-pointer' : '';
    
    return `${baseClasses} ${hoverClasses}`.trim();
  }

  getBodyClasses(): string {
    return this.padding ? 'p-6' : '';
  }
}
