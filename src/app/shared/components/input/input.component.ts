import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      @if (label) {
        <label [for]="id" class="form-label">
          {{ label }}
          @if (required) {
            <span class="text-danger-600">*</span>
          }
        </label>
      }
      
      <div class="relative">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [class]="getInputClasses()"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-invalid]="hasError"
        />
        
        @if (icon) {
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span class="text-neutral-400">{{ icon }}</span>
          </div>
        }
      </div>
      
      @if (hasError && errorMessage) {
        <p class="form-error">
          {{ errorMessage }}
        </p>
      }
      
      @if (hint && !hasError) {
        <p class="text-sm text-neutral-500 mt-1">
          {{ hint }}
        </p>
      }
    </div>
  `,
  styles: []
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() hasError = false;
  @Input() errorMessage?: string;
  @Input() hint?: string;
  @Input() icon?: string;
  @Input() ariaLabel?: string;
  
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  
  // ControlValueAccessor implementation
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getInputClasses(): string {
    const baseClasses = 'form-input';
    const errorClasses = this.hasError ? 'border-danger-500 focus:ring-danger-500' : '';
    const iconClasses = this.icon ? 'pr-10' : '';
    
    return `${baseClasses} ${errorClasses} ${iconClasses}`.trim();
  }
}
