import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { JobService } from '../../../shared/services/job.service';
import { Job } from '../../../shared/interfaces/dashboard.interface';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    ButtonComponent,
    RouterLink,
    LoaderComponent,
  ],
  template: `
    <app-dashboard-layout>
      <div class="px-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="">Job Postings</h2>
          <a routerLink="/dashboard/employer/job-posting">
            <app-button variant="primary">Create New Job</app-button>
          </a>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="py-12">
          <app-loader label="Loading job postings..." />
        </div>

        <!-- Job Postings List -->
        <div
          *ngIf="!isLoading"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          @for (job of jobPostings; track job.id) {
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 hover:border-[var(--color-accent)] transition-colors relative"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start mb-4"
            >
              <div class="flex flex-col gap-2">
                <h4 class="!font-light">{{ job.title }}</h4>

                <span
                  [class]="getStatusClasses(job.status)"
                  class="px-2 w-fit py-1 rounded-full text-xs capitalize"
                >
                  {{ job.status }}
                </span>

                <div
                  class="flex flex-wrap items-center gap-2 text-foreground-light text-sm"
                >
                  <span class="text-xs">{{ job.department }}</span>
                  <span class="hidden sm:inline">•</span>
                  <span>{{ job.location }}</span>
                  <span class="hidden sm:inline">•</span>
                  <span>{{ job.employmentType }}</span>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                <!-- Three-dot menu button -->
                <button
                  class="ml-2 p-1.5 rounded-full hover:bg-background-light/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
                  (click)="toggleDropdown(job)"
                  aria-label="Job actions"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>

                <!-- Actions dropdown -->
                <div
                  *ngIf="job.id === activeDropdown"
                  class="absolute right-6 top-14 z-10 mt-2 w-48 origin-top-right rounded-md bg-background-light/95 shadow-lg ring-1 ring-[var(--color-foreground)]/5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  tabindex="-1"
                >
                  <div class="py-1">
                    <button
                      class="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors"
                      (click)="updateStatus(job)"
                      role="menuitem"
                      tabindex="-1"
                    >
                      {{ job.status === 'draft' ? 'Publish' : 'Close' }}
                    </button>
                    <a
                      [routerLink]="['/dashboard/employer/jobs', job.id]"
                      class="block px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors"
                      role="menuitem"
                      tabindex="-1"
                    >
                      Edit
                    </a>
                    <a
                      [routerLink]="[
                        '/dashboard/employer/jobs',
                        job.id,
                        'applications'
                      ]"
                      class="block px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors"
                      role="menuitem"
                      tabindex="-1"
                    >
                      View Applications
                    </a>
                    <button
                      class="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors"
                      (click)="shareJob(job)"
                      role="menuitem"
                      tabindex="-1"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              @for (skill of job.requiredSkills; track skill) {
              <span
                class="px-2 py-1 rounded-full bg-background-light text-xs"
                >{{ skill }}</span
              >
              }
            </div>

            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-foreground-light/20"
            >
              <div
                class="flex items-center gap-4 text-sm text-foreground-light mb-2 sm:mb-0"
              >
                <a
                  [routerLink]="[
                    '/dashboard/employer/jobs',
                    job.id,
                    'applications'
                  ]"
                  class="hover:text-[var(--color-accent)]"
                >
                  {{ getApplicantText(job) }}
                </a>
                <span>Posted {{ formatDate(job.createdAt) }}</span>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- No jobs message -->
        <div
          *ngIf="!isLoading && jobPostings.length === 0"
          class="py-12 text-center text-foreground-light"
        >
          <p>
            No job postings found. Create your first job posting to get started!
          </p>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class JobPostingsComponent implements OnInit {
  jobPostings: Job[] = [];
  isLoading = false;
  activeDropdown: string | null = null;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobPostings();
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdowns.bind(this));
  }

  ngOnDestroy() {
    // Clean up event listener
    document.removeEventListener('click', this.closeDropdowns.bind(this));
  }

  // Close dropdowns when clicking outside
  closeDropdowns(event: MouseEvent) {
    if (
      this.activeDropdown &&
      event.target instanceof Element &&
      !event.target.closest('button[aria-label="Job actions"]')
    ) {
      this.activeDropdown = null;
    }
  }

  toggleDropdown(job: Job, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.activeDropdown = this.activeDropdown === job.id ? null : job.id;
  }

  private async loadJobPostings() {
    try {
      this.isLoading = true;
      const jobs = await this.jobService.getRecruiterJobs().toPromise();
      this.jobPostings = jobs || [];
    } catch (error) {
      console.error('Error loading job postings:', error);
      alert('Failed to load job postings. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'closed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-background-light text-foreground-light';
    }
  }

  async updateStatus(job: Job) {
    this.activeDropdown = null;
    try {
      const newStatus = job.status === 'draft' ? 'active' : 'closed';
      await this.jobService.updateJobStatus(job.id, newStatus).toPromise();
      // Refresh the job list
      await this.loadJobPostings();
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status. Please try again.');
    }
  }

  getApplicantText(job: Job): string {
    const count = job.applications?.length || 0;
    return `${count} ${count === 1 ? 'applicant' : 'applicants'}`;
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return d.toLocaleDateString();
  }

  shareJob(job: Job) {
    this.activeDropdown = null;
    // Implementation for sharing job posting (e.g., copy link, social share)
    const url = `${window.location.origin}/jobs/${job.id}`;
    navigator.clipboard.writeText(url).then(
      () => {
        alert('Job posting link copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy job posting link.');
      }
    );
  }
}
