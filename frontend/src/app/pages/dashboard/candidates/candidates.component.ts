import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { JobService } from '../../../shared/services/job.service';
import { JobApplication } from '../../../shared/interfaces/dashboard.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidates',
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
          <h2 class="">Candidate Management</h2>
        </div>

        <!-- Candidate List -->
        <div class="md:px-12 flex flex-col gap-6">
          @for (application of applications; track application.id) {
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 hover:border-[var(--color-accent)] transition-colors"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex gap-4">
                <img
                  [src]="'/images/profile-placeholder.jpeg'"
                  alt="Profile"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 class="font-medium">
                    {{ application.applicant.profile.firstName }}
                    {{ application.applicant.profile.lastName }}
                  </h3>
                  <p class="text-sm text-foreground-light">
                    {{ application.applicant.email }}
                  </p>
                  <p class="text-sm text-foreground-light">
                    {{ application.applicant.profile.experienceLevel }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="px-2 py-1 rounded-full"
                  [class]="getStatusClasses(application.status)"
                >
                  {{ application.status }}
                </span>
                <span
                  class="px-2 py-1 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                >
                  {{ application.matchPercentage }}% Match
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              @for (skill of application.applicant.profile.skills; track skill)
              {
              <span class="px-2 py-1 rounded-full bg-background-light text-xs">
                {{ skill }}
              </span>
              }
            </div>

            <div
              class="flex items-center justify-between pt-4 border-t border-foreground-light/20"
            >
              <span class="text-sm text-foreground-light">
                Applied {{ formatDate(application.appliedAt) }}
              </span>
              <div class="flex gap-2">
                @if (application.status === 'Pending') {
                <app-button
                  size="sm"
                  variant="primary"
                  (click)="updateStatus(application.id, 'Accepted')"
                  >Accept</app-button
                >
                <app-button
                  size="sm"
                  variant="secondary"
                  (click)="updateStatus(application.id, 'Rejected')"
                  >Reject</app-button
                >
                }
                <app-button
                  size="sm"
                  variant="secondary"
                  [routerLink]="[
                    '/dashboard/profile',
                    application.applicant.id
                  ]"
                  >View Profile</app-button
                >
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class CandidatesComponent implements OnInit {
  applications: JobApplication[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadAllApplications();
  }

  private async loadAllApplications() {
    try {
      const jobs = await this.jobService.getRecruiterJobs().toPromise();
      if (!jobs) return;

      for (const job of jobs) {
        const applications = await this.jobService
          .getJobApplications(job.id)
          .toPromise();
        if (applications) {
          this.applications.push(...applications);
        }
      }

      // Sort by match percentage
      this.applications.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'Accepted':
        return 'bg-green-500/20 text-green-500';
      case 'Rejected':
        return 'bg-red-500/20 text-red-500';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-background-light text-foreground-light';
    }
  }

  async updateStatus(applicationId: string, status: 'Accepted' | 'Rejected') {
    try {
      const application = this.applications.find(
        (app) => app.id === applicationId
      );
      if (!application) return;

      await this.jobService
        .updateApplicationStatus(application.job.id, applicationId, status)
        .toPromise();

      // Update local state
      application.status = status;
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  }

  formatDate(date: string): string {
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
}
