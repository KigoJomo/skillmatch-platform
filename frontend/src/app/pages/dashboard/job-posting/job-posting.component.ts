import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { JobService } from '../../../shared/services/job.service';

interface JobPostingStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-job-posting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayoutComponent,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <app-dashboard-layout>
      <div class="max-w-4xl mx-auto p-6">
        <h2 class="text-2xl font-semibold mb-6">Create Job Posting</h2>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="relative">
            <div class="absolute top-2 w-full h-1 bg-background-light/30"></div>
            <div
              class="absolute top-2 h-1 bg-[var(--color-accent)] transition-all duration-300"
              [style.width]="(currentStep / totalSteps) * 100 + '%'"
            ></div>
            <div class="relative flex justify-between">
              @for (step of steps; track step.id) {
              <div
                class="flex flex-col items-center"
                [class.text-[var(--color-accent)]]="currentStep >= step.id"
              >
                <div
                  class="w-5 h-5 rounded-full border-2 transition-colors duration-300 mb-2"
                  [class.bg-[var(--color-accent)]]="currentStep >= step.id"
                  [class.border-[var(--color-accent)]]="currentStep >= step.id"
                  [class.border-foreground-light]="currentStep < step.id"
                ></div>
                <span class="text-xs">{{ step.title }}</span>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div
          class="bg-background-light/30 border border-foreground-light/20 rounded-xl p-6"
        >
          <h3 class="text-lg font-medium mb-2">{{ currentStepData.title }}</h3>
          <p class="text-sm text-foreground-light mb-6">
            {{ currentStepData.description }}
          </p>

          <form [formGroup]="jobForm" (ngSubmit)="nextStep()" class="space-y-6">
            <!-- Job Details Step -->
            @if (currentStep === 1) {
            <div class="space-y-4 animate-fade-in-up">
              <app-input
                label="Job Title"
                formControlName="title"
                [error]="getErrorMessage('title')"
              ></app-input>

              <app-input
                label="Job Description"
                type="textarea"
                formControlName="description"
                [error]="getErrorMessage('description')"
              ></app-input>

              <div class="grid grid-cols-2 gap-4">
                <app-input
                  label="Department"
                  formControlName="department"
                  [error]="getErrorMessage('department')"
                ></app-input>
                <app-input
                  label="Location"
                  formControlName="location"
                  [error]="getErrorMessage('location')"
                ></app-input>
              </div>
            </div>
            }

            <!-- Requirements Step -->
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
                    <button
                      type="button"
                      (click)="removeSkill(skill)"
                      class="text-foreground-light hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                  }
                </div>
              </div>

              <app-input
                label="Experience Required"
                formControlName="experience"
                [error]="getErrorMessage('experience')"
              ></app-input>

              <app-input
                label="Education Requirements"
                formControlName="education"
                [error]="getErrorMessage('education')"
              ></app-input>
            </div>
            }

            <!-- Terms & Benefits Step -->
            @if (currentStep === 3) {
            <div class="space-y-4 animate-fade-in-up">
              <div class="grid grid-cols-2 gap-4">
                <app-input
                  label="Employment Type"
                  formControlName="employmentType"
                  [error]="getErrorMessage('employmentType')"
                ></app-input>
                <app-input
                  label="Salary Range"
                  formControlName="salaryRange"
                  [error]="getErrorMessage('salaryRange')"
                ></app-input>
              </div>

              <app-input
                label="Benefits"
                type="textarea"
                formControlName="benefits"
                [error]="getErrorMessage('benefits')"
              ></app-input>

              <app-input
                label="Working Hours"
                formControlName="workingHours"
                [error]="getErrorMessage('workingHours')"
              ></app-input>
            </div>
            }

            <!-- Preview Step -->
            @if (currentStep === 4) {
            <div class="space-y-6 animate-fade-in-up">
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-foreground-light">
                    Job Title
                  </h4>
                  <p>{{ jobForm.get('title')?.value }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-foreground-light">
                    Description
                  </h4>
                  <p>{{ jobForm.get('description')?.value }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="text-sm font-medium text-foreground-light">
                      Department
                    </h4>
                    <p>{{ jobForm.get('department')?.value }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-foreground-light">
                      Location
                    </h4>
                    <p>{{ jobForm.get('location')?.value }}</p>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-foreground-light">
                    Required Skills
                  </h4>
                  <div class="flex flex-wrap gap-2 mt-1">
                    @for (skill of skills; track skill) {
                    <span
                      class="px-2 py-1 rounded-full bg-background-light text-xs"
                      >{{ skill }}</span
                    >
                    }
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="text-sm font-medium text-foreground-light">
                      Experience
                    </h4>
                    <p>{{ jobForm.get('experience')?.value }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-foreground-light">
                      Education
                    </h4>
                    <p>{{ jobForm.get('education')?.value }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="text-sm font-medium text-foreground-light">
                      Employment Type
                    </h4>
                    <p>{{ jobForm.get('employmentType')?.value }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-foreground-light">
                      Salary Range
                    </h4>
                    <p>{{ jobForm.get('salaryRange')?.value }}</p>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-foreground-light">
                    Benefits
                  </h4>
                  <p>{{ jobForm.get('benefits')?.value }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-foreground-light">
                    Working Hours
                  </h4>
                  <p>{{ jobForm.get('workingHours')?.value }}</p>
                </div>
              </div>
            </div>
            }

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-8">
              @if (currentStep > 1) {
              <app-button
                type="button"
                variant="secondary"
                (click)="previousStep()"
              >
                Back
              </app-button>
              } @else {
              <div></div>
              }
              <app-button
                type="submit"
                variant="primary"
                [loading]="isSubmitting"
              >
                {{ currentStep === totalSteps ? 'Post Job' : 'Next' }}
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class JobPostingComponent {
  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;
  skillInput = new FormControl('');
  skills: string[] = [];
  jobForm!: FormGroup;

  steps: JobPostingStep[] = [
    {
      id: 1,
      title: 'Job Details',
      description: 'Enter the basic information about the position',
    },
    {
      id: 2,
      title: 'Requirements',
      description: 'Specify required skills and qualifications',
    },
    {
      id: 3,
      title: 'Terms & Benefits',
      description: 'Define employment terms and benefits package',
    },
    {
      id: 4,
      title: 'Preview',
      description: 'Review and confirm job posting details',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(100)]],
      department: ['', [Validators.required]],
      location: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      education: ['', [Validators.required]],
      employmentType: ['', [Validators.required]],
      salaryRange: ['', [Validators.required]],
      benefits: ['', [Validators.required]],
      workingHours: ['', [Validators.required]],
    });
  }

  get currentStepData(): JobPostingStep {
    return this.steps.find((s) => s.id === this.currentStep) || this.steps[0];
  }

  getErrorMessage(field: string): string | undefined {
    const control = this.jobForm.get(field);
    if (!control?.errors || !control.touched) return undefined;

    if (control.errors['required']) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
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

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async nextStep() {
    const currentControls = this.getCurrentStepControls();
    let isValid = true;

    currentControls.forEach((controlName) => {
      const control = this.jobForm.get(controlName);
      if (control?.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    if (this.currentStep === 2 && this.skills.length === 0) {
      isValid = false;
      alert('Please add at least one required skill');
      return;
    }

    if (!isValid) return;

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      return;
    }

    await this.submitJobPosting();
  }

  private async submitJobPosting() {
    this.isSubmitting = true;
    try {
      const jobData = {
        ...this.jobForm.value,
        requiredSkills: this.skills,
        status: 'draft',
      };

      await this.jobService.createJob(jobData).toPromise();
      alert('Job posted successfully!');
      await this.router.navigate(['/dashboard/employer/jobs']);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to post job. Please try again.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private getCurrentStepControls(): string[] {
    switch (this.currentStep) {
      case 1:
        return ['title', 'description', 'department', 'location'];
      case 2:
        return ['experience', 'education'];
      case 3:
        return ['employmentType', 'salaryRange', 'benefits', 'workingHours'];
      case 4:
        return [];
      default:
        return [];
    }
  }
}
