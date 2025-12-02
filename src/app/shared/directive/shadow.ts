import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appShadow]',
  standalone: true,
  host: {
    '(mouseover)': 'onMouseOver()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class Shadow {
  constructor(private el: ElementRef) {
    // keep a lightweight log for dev
    // console.log('Shadow directive loaded');
  }
  onMouseOver() {
    this.el.nativeElement.classList.add('shadow-lg', 'border', 'border-primary');
  }
  onMouseLeave() {
    this.el.nativeElement.classList.remove('shadow-lg', 'border', 'border-primary');
  }
}
