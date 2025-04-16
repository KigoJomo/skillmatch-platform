import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-[var(--color-background)]">
      <div class="container mx-auto px-4 py-12">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">Get in Touch</h1>
          <p class="text-lg text-foreground-light max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Our team is
            here to help.
          </p>
        </div>

        <div
          class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12"
        >
          <!-- Contact Form -->
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 h-fit"
          >
            <form
              [formGroup]="contactForm"
              (ngSubmit)="onSubmit()"
              class="flex flex-col gap-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-input
                  label="Name"
                  formControlName="name"
                  [error]="getErrorMessage('name')"
                ></app-input>
                <app-input
                  label="Email"
                  type="email"
                  formControlName="email"
                  [error]="getErrorMessage('email')"
                ></app-input>
              </div>

              <app-input
                label="Subject"
                formControlName="subject"
                [error]="getErrorMessage('subject')"
              ></app-input>

              <app-input
                label="Message"
                type="textarea"
                formControlName="message"
                [error]="getErrorMessage('message')"
              ></app-input>

              <div class="flex justify-end">
                <app-button
                  type="submit"
                  variant="primary"
                  [disabled]="!contactForm.valid || isSubmitting"
                  [loading]="isSubmitting"
                >
                  Send Message
                </app-button>
              </div>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <div
              class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
            >
              <h4 class=" mb-4">Quick Contact</h4>
              <div class="space-y-4">
                <div>
                  <h5 class="font-semibold  text-foreground-light mb-1">
                    Email
                  </h5>
                  <a
                    href="mailto:support&#64;skillmatch.com"
                    class="text-[var(--color-accent)] hover:underline"
                  >
                    support&#64;skillmatch.com
                  </a>
                </div>
                <div>
                  <h5 class="font-semibold  text-foreground-light mb-1">
                    Phone
                  </h5>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div>
                  <h5 class="font-semibold text-foreground-light mb-1">
                    Location
                  </h5>
                  <p>123 Tech Avenue<br />San Francisco, CA 94105</p>
                </div>
              </div>
            </div>

            <div
              class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
            >
              <h5 class="font-semibold mb-4">Hours of Operation</h5>
              <div class="space-y-2 text-sm">
                <p class="flex justify-between">
                  <span class="text-foreground-light">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM PST</span>
                </p>
                <p class="flex justify-between">
                  <span class="text-foreground-light">Saturday:</span>
                  <span>10:00 AM - 4:00 PM PST</span>
                </p>
                <p class="flex justify-between">
                  <span class="text-foreground-light">Sunday:</span>
                  <span>Closed</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      *ngIf="showSuccess"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div
        class="bg-[var(--color-background)] p-6 rounded-xl max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div
            class="w-16 h-16 rounded-full bg-green-500/20 text-green-500 mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 class="text-xl  mb-2">Message Sent Successfully</h3>
          <p class="text-foreground-light mb-6">
            Thank you for contacting us. We'll get back to you shortly.
          </p>
          <button
            (click)="showSuccess = false"
            class="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      *ngIf="errorMessage"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div
        class="bg-[var(--color-background)] p-6 rounded-xl max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div
            class="w-16 h-16 rounded-full bg-red-500/20 text-red-500 mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 class="text-xl  mb-2">Failed to Send Message</h3>
          <p class="text-foreground-light mb-6">{{ errorMessage }}</p>
          <button
            (click)="errorMessage = ''"
            class="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccess = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  getErrorMessage(field: string): string | undefined {
    const control = this.contactForm.get(field);
    if (!control?.errors || !control.touched) return undefined;

    if (control.errors['required']) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['minlength']) {
      return `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be at least ${
        control.errors['minlength'].requiredLength
      } characters`;
    }

    return undefined;
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      // Simulate API call with random success/failure for demonstration
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve(true);
          } else {
            reject(new Error('Network error. Please try again later.'));
          }
        }, 1000);
      });

      // Success case
      this.showSuccess = true;
      this.contactForm.reset();
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
