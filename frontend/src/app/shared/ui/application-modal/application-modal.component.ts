import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { JobListing } from '../../interfaces/dashboard.interface';

@Component({
  selector: 'app-application-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      *ngIf="isOpen"
    >
      <div
        class="w-full max-w-2xl bg-background border border-foreground-light/20 rounded-xl shadow-xl"
      >
        <div class="p-6 space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium mb-1">
                Apply for {{ job.title }}
              </h3>
              <p class="text-sm text-foreground-light">{{ job.company }}</p>
            </div>
            <button
              (click)="close()"
              class="text-foreground-light hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>

          <!-- Match Info -->
          <div
            class="p-4 bg-background-light/30 rounded-lg border border-foreground-light/10"
          >
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-foreground-light">Match Score</span>
              <span
                class="px-3 py-1 rounded-full text-sm bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
              >
                {{ job.matchPercentage }}% Match
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              @for (skill of job.requiredSkills; track skill) {
              <span
                class="px-2 py-1 text-xs rounded-full"
                [class]="
                  hasSkill(skill)
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'bg-background-light text-foreground-light'
                "
              >
                {{ skill }}
              </span>
              }
            </div>
          </div>

          <!-- Application Form -->
          <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
            <app-input
              label="Cover Letter"
              type="textarea"
              formControlName="coverLetter"
              [error]="getErrorMessage('coverLetter')"
              placeholder="Introduce yourself and explain why you're a great fit for this position..."
            ></app-input>

            <div class="flex justify-end gap-4 mt-6">
              <app-button type="button" variant="secondary" (click)="close()">
                Cancel
              </app-button>
              <app-button
                type="submit"
                [loading]="isSubmitting"
                [disabled]="!applicationForm.valid || isSubmitting"
              >
                Submit Application
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ApplicationModalComponent {
  @Input() isOpen = false;
  @Input() job!: JobListing;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitApplication = new EventEmitter<{ coverLetter: string }>();

  applicationForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.applicationForm = this.fb.group({
      coverLetter: ['', [Validators.required, Validators.minLength(100)]],
    });
  }

  hasSkill(skill: string): boolean {
    // TODO: Get user skills from profile service
    return false;
  }

  getErrorMessage(field: string): string | undefined {
    const control = this.applicationForm.get(field);
    if (!control || !control.errors || !control.touched) return undefined;

    if (control.errors['required']) {
      return 'This field is required';
    }
    if (control.errors['minlength']) {
      return 'Please write at least 100 characters';
    }
    return undefined;
  }

  close(): void {
    this.closeModal.emit();
  }

  async onSubmit(): Promise<void> {
    if (this.applicationForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      this.submitApplication.emit({
        coverLetter: this.applicationForm.value.coverLetter,
      });
    } finally {
      this.isSubmitting = false;
    }
  }
}
