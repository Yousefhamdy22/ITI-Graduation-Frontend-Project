import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label = 'زر';
  @Input() type: 'button'|'submit'|'reset' = 'button';
  @Input() variant: 'primary'|'outline' = 'primary';
  @Input() disabled = false;
}
