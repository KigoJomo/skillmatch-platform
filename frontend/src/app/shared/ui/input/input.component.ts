import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1">
      <label
        *ngIf="label"
        [for]="inputId"
        class="text-sm font-medium text-[var(--color-foreground-light)]"
      >
        {{ label }}
      </label>
      <input
        *ngIf="type !== 'textarea'"
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        [readonly]="readonly"
        class="w-full px-4 py-2 rounded-md border bg-background-light/20 border-[var(--color-foreground-light)]/20
               text-[var(--color-foreground)] placeholder-[var(--color-foreground-light)]/50
               focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
               disabled:opacity-50 disabled:cursor-not-allowed
               readonly:bg-background-light/50 readonly:cursor-default {{ class }}"
      />
      <textarea
        *ngIf="type === 'textarea'"
        [id]="inputId"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        [readonly]="readonly"
        class="w-full px-4 py-2 rounded-md border bg-background-light/20 border-[var(--color-foreground-light)]/20
               text-[var(--color-foreground)] placeholder-[var(--color-foreground-light)]/50
               focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
               disabled:opacity-50 disabled:cursor-not-allowed
               readonly:bg-background-light/50 readonly:cursor-default {{ class }}"
      ></textarea>
      <span *ngIf="error" class="text-sm text-red-500">{{ error }}</span>
    </div>
  `,
  styles: [],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() class = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() error?: string;
  @Input() readonly = false;

  readonly inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  value: string = '';
  disabled: boolean = false;
  touched: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
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
}
