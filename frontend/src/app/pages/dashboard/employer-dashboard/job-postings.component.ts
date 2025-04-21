import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { JobService } from '../../../shared/services/job.service';
import { Job } from '../../../shared/interfaces/dashboard.interface';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    ButtonComponent,
    RouterLink,
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

        <!-- Job Postings List -->
        <div class="space-y-4">
          @for (job of jobPostings; track job.id) {
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 hover:border-[var(--color-accent)] transition-colors"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="!font-light">{{ job.title }}</h4>
                <div class="flex items-center gap-4 text-foreground-light">
                  <span>{{ job.department }}</span>
                  <span>•</span>
                  <span>{{ job.location }}</span>
                  <span>•</span>
                  <span>{{ job.employmentType }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  [class]="getStatusClasses(job.status)"
                  class="px-2 py-1 rounded-full text-xs capitalize"
                >
                  {{ job.status }}
                </span>
                <button
                  class="px-3 py-1 text-sm rounded-md bg-background-light/50 hover:bg-background-light"
                  (click)="updateStatus(job)"
                >
                  {{ job.status === 'draft' ? 'Publish' : 'Close' }}
                </button>
                <app-button
                  size="sm"
                  variant="secondary"
                  [routerLink]="['/dashboard/employer/jobs', job.id]"
                  >Edit</app-button
                >
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
              class="flex items-center justify-between pt-4 border-t border-foreground-light/20"
            >
              <div
                class="flex items-center gap-6 text-sm text-foreground-light"
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
              <div class="flex gap-2">
                <app-button
                  size="sm"
                  variant="secondary"
                  [routerLink]="[
                    '/dashboard/employer/jobs',
                    job.id,
                    'applications'
                  ]"
                  >View Applications</app-button
                >
                <button
                  class="px-3 py-1 text-sm rounded-md bg-background-light/50 hover:bg-background-light"
                  (click)="shareJob(job)"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class JobPostingsComponent implements OnInit {
  jobPostings: Job[] = [];
  isLoading = false;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobPostings();
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
