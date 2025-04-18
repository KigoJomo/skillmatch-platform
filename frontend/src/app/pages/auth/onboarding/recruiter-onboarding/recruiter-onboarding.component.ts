import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-recruiter-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <main class="min-h-screen flex bg-[var(--color-background)]">
      <section class="w-full max-w-4xl mx-auto px-4 py-8">
        <!-- Progress Bar -->
        <div class="w-full max-w-xl mx-auto mb-8">
          <div class="relative">
            <div class="absolute top-2 w-full h-1 bg-background-light/30"></div>
            <div
              class="absolute top-2 h-1 bg-[var(--color-accent)] transition-all duration-300"
              [style.width]="(currentStep / totalSteps) * 100 + '%'"
            ></div>
            <div class="relative flex justify-between">
              @for (s of steps; track s.id) {
              <div
                class="flex flex-col items-center"
                [class.text-[var(--color-accent)]]="currentStep >= s.id"
              >
                <div
                  class="w-5 h-5 rounded-full border-2 transition-colors duration-300 mb-2"
                  [class.bg-[var(--color-accent)]]="currentStep >= s.id"
                  [class.border-[var(--color-accent)]]="currentStep >= s.id"
                  [class.border-foreground-light]="currentStep < s.id"
                ></div>
                <span class="text-xs">{{ s.title }}</span>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div class="max-w-xl mx-auto">
          <div class="animate-scale-in">
            <h2 class="text-center mb-6">{{ currentStepData.title }}</h2>
            <p class="text-center mb-8 text-foreground-light">
              {{ currentStepData.description }}
            </p>

            <form
              [formGroup]="onboardingForm"
              (ngSubmit)="nextStep()"
              class="flex flex-col gap-6"
            >
              <!-- Company Profile Step -->
              @if (currentStep === 1) {
              <div class="space-y-4 animate-fade-in-up">
                <div class="flex justify-center mb-6">
                  <div class="relative">
                    <img
                      [src]="
                        companyLogoUrl || '/images/profile-placeholder.jpeg'
                      "
                      alt="Company Logo"
                      class="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      (click)="uploadLogo()"
                      class="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--color-accent)] text-background"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <app-input
                    label="Company Phone"
                    type="tel"
                    formControlName="phone"
                    [error]="getErrorMessage('phone')"
                  ></app-input>
                  <app-input
                    label="Company Location"
                    formControlName="location"
                    [error]="getErrorMessage('location')"
                  ></app-input>
                </div>

                <app-input
                  label="Company Description"
                  type="text"
                  formControlName="description"
                  [error]="getErrorMessage('description')"
                ></app-input>

                <div class="grid grid-cols-2 gap-4">
                  <app-input
                    label="Industry"
                    formControlName="industry"
                    [error]="getErrorMessage('industry')"
                  ></app-input>
                  <app-input
                    label="Company Size"
                    formControlName="companySize"
                    [error]="getErrorMessage('companySize')"
                  ></app-input>
                </div>

                <app-input
                  label="Company Website"
                  type="text"
                  formControlName="website"
                  [error]="getErrorMessage('website')"
                ></app-input>
              </div>
              }

              <!-- Hiring Needs Step -->
              @if (currentStep === 2) {
              <div class="space-y-4 animate-fade-in-up">
                <div class="border border-foreground-light/30 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <app-input
                      placeholder="Add required skills (e.g. JavaScript)"
                      [formControl]="skillInput"
                      (keyup.enter)="addSkill()"
                    ></app-input>
                    <app-button
                      type="button"
                      variant="secondary"
                      (click)="addSkill()"
                      >Add</app-button
                    >
                  </div>
                  <div class="flex flex-wrap gap-2">
                    @for (skill of skills; track skill) {
                    <div
                      class="flex items-center gap-2 px-3 py-1 rounded-full bg-background-light/30 border border-foreground-light/30"
                    >
                      <span>{{ skill }}</span>
                      <app-button
                        type="button"
                        size="sm"
                        variant="secondary"
                        (click)="removeSkill(skill)"
                        class="!p-0 !border-0 !bg-transparent hover:!text-foreground"
                      >
                        ×
                      </app-button>
                    </div>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2"
                    >Job Types You're Hiring For</label
                  >
                  <div class="space-y-2">
                    @for (type of jobTypes; track type) {
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        [id]="type"
                        [value]="type"
                        (change)="toggleJobType(type)"
                        [checked]="selectedJobTypes.includes(type)"
                        class="rounded border-foreground-light/30 bg-transparent"
                      />
                      <label [for]="type" class="ml-2 text-sm">{{
                        type
                      }}</label>
                    </div>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium"
                    >Experience Level Requirements</label
                  >
                  @for (level of experienceLevels; track level) {
                  <div
                    class="flex items-center p-3 rounded-lg border border-foreground-light/30 cursor-pointer"
                    [class.border-[var(--color-accent)]]="
                      selectedExperience === level
                    "
                    (click)="selectExperience(level)"
                  >
                    <input
                      type="radio"
                      [value]="level"
                      [checked]="selectedExperience === level"
                      class="mr-3"
                    />
                    <span>{{ level }}</span>
                  </div>
                  }
                </div>
              </div>
              }

              <!-- Recruitment Preferences Step -->
              @if (currentStep === 3) {
              <div class="flex flex-col gap-6 animate-fade-in-up">
                <app-input
                  label="Salary Range Offered"
                  type="text"
                  formControlName="salaryRange"
                  [error]="getErrorMessage('salaryRange')"
                ></app-input>

                <app-input
                  label="Work Location Options"
                  type="text"
                  formControlName="workLocations"
                  [error]="getErrorMessage('workLocations')"
                ></app-input>

                <app-input
                  label="Interview Process Description"
                  type="text"
                  formControlName="interviewProcess"
                  [error]="getErrorMessage('interviewProcess')"
                ></app-input>

                <app-input
                  label="Benefits and Perks"
                  type="text"
                  formControlName="benefits"
                  [error]="getErrorMessage('benefits')"
                ></app-input>
              </div>
              }

              <!-- Navigation Buttons -->
              <div class="flex justify-between mt-8">
                @if (currentStep > 1) {
                <app-button
                  type="button"
                  variant="secondary"
                  (click)="previousStep()"
                  >Back</app-button
                >
                }
                <div class="flex-1"></div>
                @if (currentStep === 1) {
                <app-button
                  type="button"
                  variant="secondary"
                  (click)="skipOnboarding()"
                  [loading]="isSkipping"
                  class="mr-4"
                  >Skip for Now</app-button
                >
                }
                <app-button
                  type="submit"
                  variant="primary"
                  [loading]="isLoading"
                >
                  {{ currentStep === totalSteps ? 'Complete' : 'Next' }}
                </app-button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class RecruiterOnboardingComponent {
  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  isSkipping = false;
  onboardingForm!: FormGroup;
  skillInput = new FormControl('');
  skills: string[] = [];
  selectedExperience = '';
  selectedJobTypes: string[] = [];
  companyLogoUrl = '';

  steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Company Profile',
      description: 'Tell us about your company',
    },
    {
      id: 2,
      title: 'Hiring Needs',
      description: 'What kind of talent are you looking for?',
    },
    {
      id: 3,
      title: 'Recruitment Preferences',
      description: 'Set your recruitment preferences',
    },
  ];

  experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (2-5 years)',
    'Senior Level (5-8 years)',
    'Expert Level (8+ years)',
  ];

  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
    this.onboardingForm = this.fb.group({
      phone: [''],
      location: [''],
      description: [''],
      industry: [''],
      companySize: [''],
      website: [''],
      salaryRange: [''],
      workLocations: [''],
      interviewProcess: [''],
      benefits: [''],
    });
  }

  get currentStepData(): OnboardingStep {
    return (
      this.steps.find((step) => step.id === this.currentStep) || this.steps[0]
    );
  }

  getErrorMessage(field: string): string | undefined {
    return undefined; // No validation in development
  }

  validateCurrentStep(): boolean {
    return true; // No validation in development
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      return;
    }

    await this.completeOnboarding();
  }

  async skipOnboarding() {
    this.isSkipping = true

    try {
      await this.authService.skipOnboarding();
      await this.navigateToDashboard()
    } finally {
      this.isSkipping = false
    }
  }

  private async completeOnboarding() {
    this.isLoading = true;
    try {
      const onboardingData = {
        ...this.onboardingForm.value,
        skills: this.skills,
        experienceLevel: this.selectedExperience,
        jobTypes: this.selectedJobTypes,
      };

      await this.authService.completeOnboarding(onboardingData);
      await this.navigateToDashboard();
    } finally {
      this.isLoading = false;
    }
  }

  private async navigateToDashboard() {
    const role =
      this.authService.currentUser?.role === 'Job Seeker'
        ? 'seeker'
        : 'employer';
    await this.router.navigate([`/dashboard/${role}`]);
  }

  uploadLogo() {
    console.log('Upload company logo');
  }

  addSkill() {
    const skill = this.skillInput.value?.trim();
    if (skill && !this.skills.includes(skill)) {
      this.skills.push(skill);
      this.skillInput.setValue('');
    }
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter((s) => s !== skill);
  }

  selectExperience(level: string) {
    this.selectedExperience = level;
  }

  toggleJobType(type: string) {
    const index = this.selectedJobTypes.indexOf(type);
    if (index === -1) {
      this.selectedJobTypes.push(type);
    } else {
      this.selectedJobTypes.splice(index, 1);
    }
  }
}
