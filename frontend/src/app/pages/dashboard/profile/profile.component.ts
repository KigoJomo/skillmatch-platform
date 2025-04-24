import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import {
  Profile,
  Project,
} from '../../../shared/interfaces/dashboard.interface';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayoutComponent,
    ButtonComponent,
    InputComponent,
    LoaderComponent,
  ],
  template: `
    <app-dashboard-layout>
      @if (isLoading) {
      <div class="flex items-center justify-center py-20">
        <app-loader label="Loading profile..." />
      </div>
      } @else {
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- Profile Overview -->
        <div
          class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 flex flex-col gap-6"
        >
          <div class="flex items-start justify-between mb-6">
            <div class="flex gap-4">
              <div class="relative">
                <div
                  class="w-24 aspect-square rounded-full bg-[var(--color-accent)] capitalize flex items-center justify-center text-background-light/70 font-medium text-6xl"
                >
                  {{ getInitial() }}
                </div>
              </div>
              <div>
                <h1 class="text-2xl font-medium">
                  {{ this.authService.currentUser?.firstName }}
                </h1>
              </div>
            </div>
            <app-button variant="secondary" (click)="toggleEdit()">{{
              isEditing ? 'Cancel' : 'Edit Profile'
            }}</app-button>
          </div>

          <!-- Job Seeker Content -->
          <ng-container *ngIf="authService.currentUser?.role === 'Job Seeker'">
            <form
              [formGroup]="profileForm"
              (ngSubmit)="onSubmit()"
              class="space-y-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-input
                  label="First Name"
                  formControlName="firstName"
                  [error]="getErrorMessage('firstName')"
                  [readonly]="!isEditing"
                  class="*:!capitalize"
                ></app-input>
                <app-input
                  label="Last Name"
                  formControlName="lastName"
                  [error]="getErrorMessage('lastName')"
                  [readonly]="!isEditing"
                  class="*:!capitalize"
                ></app-input>
                <app-input
                  label="Phone"
                  type="tel"
                  formControlName="phone"
                  [error]="getErrorMessage('phone')"
                  [readonly]="!isEditing"
                ></app-input>
                <app-input
                  label="Location"
                  formControlName="location"
                  [error]="getErrorMessage('location')"
                  [readonly]="!isEditing"
                ></app-input>
                <app-input
                  label="Experience Level"
                  formControlName="experienceLevel"
                  [error]="getErrorMessage('experienceLevel')"
                  [readonly]="!isEditing"
                ></app-input>
              </div>

              <div>
                <app-input
                  label="Bio"
                  type="textarea"
                  formControlName="bio"
                  [error]="getErrorMessage('bio')"
                  [readonly]="!isEditing"
                ></app-input>
              </div>

              @if (isEditing) {
              <div class="flex justify-end gap-4">
                <app-button
                  type="button"
                  variant="secondary"
                  (click)="toggleEdit()"
                  >Cancel</app-button
                >
                <app-button type="submit" variant="primary" [loading]="isSaving"
                  >Save Changes</app-button
                >
              </div>
              }
            </form>

            <div
              class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
            >
              <div class="flex justify-between items-center mb-6">
                <h3 class="">Skills & Expertise</h3>
                <app-button variant="secondary" (click)="toggleSkillEdit()">
                  {{ isEditingSkills ? 'Done' : 'Manage Skills' }}
                </app-button>
              </div>

              @if (isEditingSkills) {
              <div class="mb-6">
                <div class="flex gap-2 mb-4">
                  <app-input
                    [formControl]="skillInput"
                    placeholder="Add a skill (e.g. JavaScript)"
                    (keyup.enter)="addSkill()"
                  ></app-input>
                  <app-button
                    type="button"
                    variant="secondary"
                    (click)="addSkill()"
                    >Add</app-button
                  >
                </div>
              </div>
              }

              <div class="flex flex-wrap gap-2">
                @for (skill of skills; track skill.name) {
                <div
                  class="group flex items-center gap-2 px-3 py-1 rounded-full bg-background-light/30 border border-foreground-light/30"
                >
                  <span class="">{{ skill.name }}</span>

                  <div class="flex items-center gap-1">
                    @if (isEditingSkills) {
                    <button
                      type="button"
                      (click)="removeSkill(skill)"
                      class="text-foreground-light font-pop text-[0.65rem] hover:text-foreground"
                    >
                      X
                    </button>
                    }
                  </div>
                </div>
                }
              </div>
            </div>

            <div
              class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
            >
              <div class="flex justify-between items-center mb-6">
                <h3 class="">Portfolio Projects</h3>
                <app-button variant="secondary" (click)="toggleProjectEdit()">
                  {{ isEditingProjects ? 'Done' : 'Add Project' }}
                </app-button>
              </div>

              @if (isEditingProjects) {
              <form
                [formGroup]="projectForm"
                (ngSubmit)="addProject()"
                class="mb-6 p-4 bg-background-light/50 rounded-lg border border-foreground-light/20"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <app-input
                    label="Project Name"
                    formControlName="name"
                    [error]="getProjectErrorMessage('name')"
                  ></app-input>
                  <app-input
                    label="Project URL"
                    formControlName="url"
                    [error]="getProjectErrorMessage('url')"
                  ></app-input>
                </div>
                <app-input
                  label="Description"
                  type="textarea"
                  formControlName="description"
                  [error]="getProjectErrorMessage('description')"
                ></app-input>
                <div class="mt-4">
                  <label
                    class="text-sm font-medium text-[var(--color-foreground-light)]"
                    >Technologies Used</label
                  >
                  <div class="flex gap-2 mt-2">
                    <app-input
                      formControlName="skillInput"
                      placeholder="Add a technology (e.g. Angular)"
                      (keyup.enter)="addProjectSkill()"
                    ></app-input>
                    <app-button
                      type="button"
                      variant="secondary"
                      (click)="addProjectSkill()"
                      >Add</app-button
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 mt-2">
                    @for (skill of projectForm.get('skillsUsed')?.value; track
                    skill) {
                    <div
                      class="group flex items-center gap-2 px-3 py-1 rounded-full bg-background-light/30 border border-foreground-light/30"
                    >
                      <span>{{ skill }}</span>
                      <button
                        type="button"
                        (click)="removeProjectSkill(skill)"
                        class="text-foreground-light font-pop text-[0.65rem] hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                    }
                  </div>
                </div>
                <div class="flex justify-end mt-4">
                  <app-button
                    type="submit"
                    variant="primary"
                    [disabled]="!projectForm.valid"
                    >Add Project</app-button
                  >
                </div>
              </form>
              }

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (project of projects; track project.id) {
                <div
                  class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-2 aspect-square rounded-full bg-accent/60 shrink-0"
                      ></div>
                      <h4 class="!font-light">{{ project.name }}</h4>
                    </div>
                    @if (isEditingProjects) {
                    <button
                      type="button"
                      (click)="removeProject(project)"
                      class="text-foreground-light hover:text-foreground"
                    >
                      ×
                    </button>
                    }
                  </div>
                  <p class="text-sm text-foreground-light mb-3">
                    {{ project.description }}
                  </p>
                  @if (project.url) {
                  <a
                    [href]="project.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-[var(--color-accent)] hover:underline inline-block mb-2"
                    >View Project</a
                  >
                  } @if (project.skillsUsed?.length) {
                  <div class="flex flex-wrap gap-2">
                    @for (skill of project.skillsUsed; track skill) {
                    <div
                      class="px-2 py-1 text-xs rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    >
                      {{ skill }}
                    </div>
                    }
                  </div>
                  }
                </div>
                }
              </div>
            </div>
          </ng-container>

          <!-- Employer Content -->
          <ng-container
            *ngIf="authService.currentUser?.role === 'Employer/Recruiter'"
          >
            <form
              [formGroup]="companyForm"
              (ngSubmit)="onSubmit()"
              class="space-y-8"
            >
              <!-- Basic Company Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium mb-4">
                  Basic Company Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-input
                    label="Company Name"
                    formControlName="companyName"
                    [error]="getCompanyErrorMessage('companyName')"
                    [readonly]="!isEditing"
                  ></app-input>
                  <app-input
                    label="Industry"
                    formControlName="industry"
                    [error]="getCompanyErrorMessage('industry')"
                    [readonly]="!isEditing"
                  ></app-input>
                  <app-input
                    label="Company Size"
                    formControlName="companySize"
                    [error]="getCompanyErrorMessage('companySize')"
                    [readonly]="!isEditing"
                    placeholder="e.g. 50-100 employees"
                  ></app-input>
                  <app-input
                    label="Website"
                    formControlName="website"
                    [error]="getCompanyErrorMessage('website')"
                    [readonly]="!isEditing"
                  ></app-input>
                </div>
                <app-input
                  label="Company Description"
                  type="textarea"
                  formControlName="description"
                  [error]="getCompanyErrorMessage('description')"
                  [readonly]="!isEditing"
                ></app-input>
              </div>

              <!-- Work Environment & Culture -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium mb-4">
                  Work Environment & Culture
                </h3>
                <div class="grid grid-cols-1 gap-6">
                  <app-input
                    label="Work Locations"
                    formControlName="workLocations"
                    [error]="getCompanyErrorMessage('workLocations')"
                    [readonly]="!isEditing"
                    placeholder="e.g. Hybrid, Remote, Office locations"
                  ></app-input>
                  <app-input
                    label="Benefits & Perks"
                    type="textarea"
                    formControlName="benefits"
                    [error]="getCompanyErrorMessage('benefits')"
                    [readonly]="!isEditing"
                    placeholder="List your company benefits and perks"
                  ></app-input>
                  <app-input
                    label="Salary Range"
                    formControlName="salaryRange"
                    [error]="getCompanyErrorMessage('salaryRange')"
                    [readonly]="!isEditing"
                    placeholder="e.g. $80,000 - $120,000"
                  ></app-input>
                </div>
              </div>

              <!-- Hiring Details -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium mb-4">Hiring Process</h3>
                <div class="grid grid-cols-1 gap-6">
                  <app-input
                    label="Interview Process"
                    type="textarea"
                    formControlName="interviewProcess"
                    [error]="getCompanyErrorMessage('interviewProcess')"
                    [readonly]="!isEditing"
                    placeholder="Describe your interview stages and process"
                  ></app-input>
                </div>
              </div>

              @if (isEditing) {
              <div class="flex justify-end gap-4">
                <app-button
                  type="button"
                  variant="secondary"
                  (click)="toggleEdit()"
                  >Cancel</app-button
                >
                <app-button type="submit" variant="primary" [loading]="isSaving"
                  >Save Changes</app-button
                >
              </div>
              }
            </form>
          </ng-container>
        </div>
        @if (isSaving) {
        <div
          class="fixed inset-0 bg-background/50 flex items-center justify-center z-50"
        >
          <app-loader label="Saving changes..." />
        </div>
        }
      </div>
      }
    </app-dashboard-layout>
  `,
})
export class ProfileComponent implements OnInit {
  profileImageUrl: string | null = null;
  isEditing = false;
  isEditingSkills = false;
  isEditingProjects = false;
  isSaving = false;
  isEditingCompany = false;
  isLoading = false;

  skillInput = new FormControl('');
  skills: { name: string }[] = [];
  projects: Project[] = [];
  profile: Profile | null = null;

  profileForm: FormGroup;
  projectForm: FormGroup;
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      location: ['', [Validators.required]],
      experienceLevel: ['', [Validators.required]],
      bio: ['', [Validators.required]],
    });

    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      url: [''],
      skillInput: [''],
      skillsUsed: [[]],
    });

    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      companySize: ['', [Validators.required]],
      website: ['', [Validators.required, Validators.pattern('https?://.+')]],
      description: ['', [Validators.required]],
      workLocations: ['', [Validators.required]],
      benefits: ['', [Validators.required]],
      salaryRange: ['', [Validators.required]],
      interviewProcess: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadProfileData();
    this.loadProjects();
  }

  private loadProfileData() {
    this.isLoading = true;
    this.dashboardService.getProfileData().subscribe({
      next: (profile) => {
        this.profile = profile;
        if (profile) {
          // Handle job seeker profile
          if (this.authService.currentUser?.role === 'Job Seeker') {
            this.profileForm.patchValue({
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
              location: profile.location,
              experienceLevel: profile.experienceLevel,
              bio: profile.bio,
            });

            if (profile.skills) {
              this.skills = profile.skills.map((skill: any) => ({
                name: skill,
              }));
            }
          }
          // Handle employer profile
          else if (
            this.authService.currentUser?.role === 'Employer/Recruiter'
          ) {
            this.companyForm.patchValue({
              companyName: profile.firstName,
              industry: profile.industry,
              companySize: profile.companySize,
              website: profile.website,
              description: profile.description,
              workLocations: profile.workLocations,
              benefits: profile.benefits,
              salaryRange: profile.salaryRange,
              interviewProcess: profile.interviewProcess,
            });
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile data:', error);
        this.isLoading = false;
      },
    });
  }

  private loadProjects() {
    if (this.authService.currentUser?.role === 'Job Seeker') {
      this.dashboardService.getUserProjects().subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error loading projects:', error);
        },
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.profile) {
      this.profileForm.patchValue({
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        phone: this.profile.phone,
        location: this.profile.location,
        experienceLevel: this.profile.experienceLevel,
        bio: this.profile.bio,
      });
    }
  }

  toggleSkillEdit() {
    this.isEditingSkills = !this.isEditingSkills;
    this.skillInput.reset();

    // If we're exiting edit mode, save the changes
    if (!this.isEditingSkills) {
      this.saveSkills();
    }
  }

  private async saveSkills() {
    try {
      const updatedProfile = await this.dashboardService
        .updateProfile({
          ...this.profile,
          skills: this.skills.map((s) => s.name),
        })
        .toPromise();

      if (updatedProfile) {
        this.profile = updatedProfile;
        alert('Skills updated successfully!');
      }
    } catch (error) {
      console.error('Error updating skills:', error);
      alert('Failed to update skills. Please try again.');
      // Reload original skills on error
      this.loadProfileData();
    }
  }

  toggleProjectEdit() {
    this.isEditingProjects = !this.isEditingProjects;
    this.projectForm.reset();
  }

  toggleCompanyEdit() {
    this.isEditingCompany = !this.isEditingCompany;
    if (!this.isEditingCompany) {
      this.companyForm.reset();
    }
  }

  async uploadImage() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          alert('Image size should be less than 5MB');
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.profileImageUrl = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);

        // TODO: Upload to server when backend is ready
        // const formData = new FormData();
        // formData.append('image', file);
        // await this.profileService.uploadImage(formData);
      });

      input.click();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  }

  addSkill() {
    const skill = this.skillInput.value?.trim();
    if (skill && !this.skills.find((s) => s.name === skill)) {
      this.skills.push({ name: skill });
      this.skillInput.reset();
    }
  }

  removeSkill(skill: { name: string }) {
    this.skills = this.skills.filter((s) => s.name !== skill.name);
  }

  addProject() {
    if (this.projectForm.valid) {
      const newProject: Project = {
        ...this.projectForm.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add to UI
      this.projects = [...this.projects, newProject];

      // Make API call
      this.dashboardService.addProject(newProject).subscribe({
        next: (savedProject) => {
          // Replace optimistic project with saved one
          this.projects = this.projects.map((p) =>
            p.name === newProject.name ? savedProject : p
          );
          this.projectForm.reset();
        },
        error: (error) => {
          console.error('Error saving project:', error);
          // Revert optimistic update on error
          this.projects = this.projects.filter(
            (p) => p.name !== newProject.name
          );
          alert('Failed to save project. Please try again.');
        },
      });
    }
  }

  removeProject(project: Project) {
    if (!project.id) {
      console.error('Cannot delete project without ID');
      return;
    }

    // Optimistically remove from UI
    const previousProjects = [...this.projects];
    this.projects = this.projects.filter((p) => p.id !== project.id);

    // Make API call
    this.dashboardService.deleteProject(project.id).subscribe({
      error: (error) => {
        console.error('Error deleting project:', error);
        // Revert optimistic update on error
        this.projects = previousProjects;
        alert('Failed to delete project. Please try again.');
      },
    });
  }

  addProjectSkill() {
    const skillControl = this.projectForm.get('skillInput');
    const skill = skillControl?.value?.trim();
    if (skill) {
      const skills = this.projectForm.get('skillsUsed')?.value || [];
      if (!skills.includes(skill)) {
        this.projectForm.patchValue({
          skillsUsed: [...skills, skill],
        });
      }
      if (skillControl) {
        skillControl.reset();
      }
    }
  }

  removeProjectSkill(skillToRemove: string) {
    const skills = this.projectForm.get('skillsUsed')?.value || [];
    this.projectForm.patchValue({
      skillsUsed: skills.filter((skill: string) => skill !== skillToRemove),
    });
  }

  async onSubmit() {
    // For job seeker profile
    if (this.authService.currentUser?.role === 'Job Seeker') {
      if (!this.profileForm.valid) {
        Object.keys(this.profileForm.controls).forEach((key) => {
          const control = this.profileForm.get(key);
          if (control?.invalid) {
            control.markAsTouched();
          }
        });
        return;
      }

      this.isSaving = true;
      try {
        const formValues = this.profileForm.value;
        const updatedProfile = await this.dashboardService
          .updateProfile({
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phone: formValues.phone,
            location: formValues.location,
            experienceLevel: formValues.experienceLevel,
            bio: formValues.bio,
            skills: this.skills.map((s) => s.name),
          })
          .toPromise();

        if (updatedProfile) {
          this.profile = updatedProfile;
          this.toggleEdit();
        }
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert(
          error instanceof Error
            ? error.message
            : 'Failed to update profile. Please try again.'
        );
      } finally {
        this.isSaving = false;
      }
    }
    // For employer profile
    else if (this.authService.currentUser?.role === 'Employer/Recruiter') {
      if (!this.companyForm.valid) {
        Object.keys(this.companyForm.controls).forEach((key) => {
          const control = this.companyForm.get(key);
          if (control?.invalid) {
            control.markAsTouched();
          }
        });
        return;
      }

      this.isSaving = true;
      try {
        const formValues = this.companyForm.value;
        const updatedProfile = await this.dashboardService
          .updateProfile({
            firstName: formValues.companyName, // Using firstName field for company name
            industry: formValues.industry,
            companySize: formValues.companySize,
            website: formValues.website,
            description: formValues.description,
            workLocations: formValues.workLocations,
            benefits: formValues.benefits,
            salaryRange: formValues.salaryRange,
            interviewProcess: formValues.interviewProcess,
          })
          .toPromise();

        if (updatedProfile) {
          this.profile = updatedProfile;
          this.toggleEdit();
        }
        alert('Company profile updated successfully!');
      } catch (error) {
        console.error('Error updating company profile:', error);
        alert(
          error instanceof Error
            ? error.message
            : 'Failed to update company profile. Please try again.'
        );
      } finally {
        this.isSaving = false;
      }
    }
  }

  getErrorMessage(field: string): string | undefined {
    const control = this.profileForm.get(field);
    if (!control?.errors || !control.touched) return undefined;

    if (control.errors['required']) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }

    return undefined;
  }

  getProjectErrorMessage(field: string): string | undefined {
    const control = this.projectForm.get(field);
    if (!control?.errors || !control.touched) return undefined;

    if (control.errors['required']) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    return undefined;
  }

  getCompanyErrorMessage(field: string): string | undefined {
    const control = this.companyForm.get(field);
    if (!control?.errors || !control.touched) return undefined;

    if (control.errors['required']) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.errors['pattern'] && field === 'website') {
      return 'Please enter a valid website URL starting with http:// or https://';
    }

    return undefined;
  }

  // Navigate back to appropriate dashboard
  navigateBack() {
    const route =
      this.authService.currentUser?.role === 'Job Seeker'
        ? 'seeker'
        : 'employer';
    this.router.navigate(['/dashboard', route, 'overview']);
  }

  getInitial(): string {
    return this.authService.currentUser?.firstName?.charAt(0) ?? '';
  }
}
