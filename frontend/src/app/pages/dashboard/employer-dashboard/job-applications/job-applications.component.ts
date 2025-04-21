import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutComponent } from '../../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { JobService } from '../../../../shared/services/job.service';
import {
  JobApplication,
  Job,
} from '../../../../shared/interfaces/dashboard.interface';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent, ButtonComponent],
  template: `
    <app-dashboard-layout>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-semibold">
              {{ job?.title || 'Job Applications' }}
            </h2>
            <p class="text-foreground-light mt-1">
              {{ applications.length }} application{{
                applications.length !== 1 ? 's' : ''
              }}
            </p>
          </div>
          <div class="flex gap-4">
            <select
              (change)="filterByStatus($event)"
              class="px-3 py-1 rounded-md bg-background-light/50 border border-foreground-light/20"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              (change)="sortApplications($event)"
              class="px-3 py-1 rounded-md bg-background-light/50 border border-foreground-light/20"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="match-desc">Best Match First</option>
            </select>
          </div>
        </div>

        <div class="space-y-6">
          @for (application of filteredApplications; track application.id) {
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-medium">
                  {{ application.applicant.profile.firstName }}
                  {{ application.applicant.profile.lastName }}
                </h3>
                <div class="flex items-center gap-4 text-foreground-light mt-1">
                  <span>{{ application.applicant.email }}</span>
                  <span>•</span>
                  <span>{{ application.applicant.profile.location }}</span>
                  <span>•</span>
                  <span>{{
                    application.applicant.profile.experienceLevel
                  }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div
                  class="px-3 py-1 rounded-full text-sm"
                  [class]="getStatusClasses(application.status)"
                >
                  {{ application.status }}
                </div>
                <span
                  class="px-3 py-1 rounded-full text-sm bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  >{{ application.matchPercentage }}% Match</span
                >
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium text-foreground-light mb-2">
                Skills
              </h4>
              <div class="flex flex-wrap gap-2">
                @for (skill of application.applicant.profile.skills; track
                skill) {
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  [class]="
                    isRequiredSkill(skill)
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'bg-background-light text-foreground-light'
                  "
                  >{{ skill }}</span
                >
                }
              </div>
            </div>

            <div class="mb-6">
              <h4 class="text-sm font-medium text-foreground-light mb-2">
                Cover Letter
              </h4>
              <p class="text-foreground-light">{{ application.coverLetter }}</p>
            </div>

            <div
              class="flex items-center justify-between pt-4 border-t border-foreground-light/20"
            >
              <div class="text-sm text-foreground-light">
                Applied {{ formatDate(application.appliedAt) }}
              </div>
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
                <app-button size="sm" variant="secondary"
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
export class JobApplicationsComponent implements OnInit {
  jobId: string = '';
  job?: Job;
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];

  constructor(private route: ActivatedRoute, private jobService: JobService) {}

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';
    this.loadJobApplications();
  }

  private async loadJobApplications() {
    try {
      const applications = await this.jobService
        .getJobApplications(this.jobId)
        .toPromise();
      this.applications = applications || [];
      this.filteredApplications = [...this.applications];
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Failed to load applications. Please try again.');
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

  filterByStatus(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.filteredApplications =
      status === 'all'
        ? [...this.applications]
        : this.applications.filter((app) => app.status === status);
  }

  sortApplications(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    switch (value) {
      case 'date-desc':
        this.filteredApplications.sort(
          (a, b) =>
            new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
        break;
      case 'date-asc':
        this.filteredApplications.sort(
          (a, b) =>
            new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        );
        break;
      case 'match-desc':
        this.filteredApplications.sort(
          (a, b) => b.matchPercentage - a.matchPercentage
        );
        break;
    }
  }

  async updateStatus(applicationId: string, status: 'Accepted' | 'Rejected') {
    try {
      await this.jobService
        .updateApplicationStatus(this.jobId, applicationId, status)
        .toPromise();
      await this.loadJobApplications();
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

  isRequiredSkill(skill: string): boolean {
    return this.job?.requiredSkills?.includes(skill) || false;
  }
}
