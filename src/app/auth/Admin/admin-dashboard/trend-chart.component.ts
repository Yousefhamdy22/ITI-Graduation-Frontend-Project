import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <svg [attr.viewBox]="'0 0 ' + width + ' ' + height" [attr.width]="width" [attr.height]="height">
        <polyline
          [attr.points]="points"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-indigo-600"
        />
        <g *ngFor="let p of pointList; let i = index">
          <circle [attr.cx]="p.x" [attr.cy]="p.y" r="2.5" fill="#fff" stroke="#4f46e5" stroke-width="1.5"></circle>
        </g>
      </svg>
      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span *ngFor="let l of labels; let i = index">{{ l }}</span>
      </div>
    </div>
  `
})
export class TrendChartComponent {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() width = 300;
  @Input() height = 80;

  get pointList() {
    const d = this.data || [];
    const w = Math.max(1, this.width - 10);
    const h = Math.max(10, this.height - 10);
    const max = Math.max(...(d.length ? d : [0]));
    const min = Math.min(...(d.length ? d : [0]));
    const range = max - min || 1;
    return d.map((v, i) => {
      const x = 5 + (i * w) / Math.max(1, d.length - 1);
      const y = 5 + h - ((v - min) / range) * h;
      return { x, y };
    });
  }

  get points() {
    return this.pointList.map(p => `${p.x},${p.y}`).join(' ');
  }
}
