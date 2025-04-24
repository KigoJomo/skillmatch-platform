import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { JobService } from '../../../shared/services/job.service';
import { JobApplication } from '../../../shared/interfaces/dashboard.interface';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-candidates',
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
          <div>
            <h2 class="text-2xl font-semibold">Candidate Management</h2>
            <p class="text-sm text-foreground-light mt-1">
              {{ applications.length }} total candidates
            </p>
          </div>

          <!-- Filtering Controls -->
          <div class="flex gap-4">
            <select
              (change)="filterByStatus($event)"
              class="px-3 py-1.5 rounded-md bg-background-light/50 border border-foreground-light/20 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              (change)="sortApplications($event)"
              class="px-3 py-1.5 rounded-md bg-background-light/50 border border-foreground-light/20 text-sm"
            >
              <option value="match-desc">Best Match First</option>
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>
        </div>

        <!-- Candidate List -->
        <div class="md:px-12">
          @if (isLoading) {
          <app-loader label="Loading candidates..." class="py-12" />
          } @else if (filteredApplications.length === 0) {
          <div class="flex flex-col items-center justify-center py-12">
            <p class="text-foreground-light">
              No candidates match the current filters.
            </p>
          </div>
          } @else {
          <div class="flex flex-col gap-6">
            @for (application of filteredApplications; track application.id) {
            <div
              class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 hover:border-[var(--color-accent)] transition-colors"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-[var(--color-accent)] capitalize flex items-center justify-center text-background-light/70 font-medium text-xl"
                  >
                    {{ getInitials(application.applicant.profile) }}
                  </div>
                  <div>
                    <h3 class="font-medium">
                      {{ application.applicant.profile.firstName }}
                      {{ application.applicant.profile.lastName }}
                    </h3>
                    <p class="text-sm text-foreground-light">
                      {{ application.applicant.email }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm text-foreground-light">
                        {{ application.applicant.profile.experienceLevel }}
                      </span>
                      @if (application.applicant.profile.location) {
                      <span class="text-sm text-foreground-light">•</span>
                      <span class="text-sm text-foreground-light">
                        {{ application.applicant.profile.location }}
                      </span>
                      }
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span
                    class="px-2 py-1 rounded-full text-sm"
                    [class]="getStatusClasses(application.status)"
                  >
                    {{ application.status }}
                  </span>
                  <span
                    class="px-2 py-1 rounded-full text-sm bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  >
                    {{ application.matchPercentage.toFixed(0) }}% Match
                  </span>
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
                    class="px-2 py-1 rounded-full text-xs"
                    [class]="
                      isJobRequiredSkill(skill, application.job)
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'bg-background-light text-foreground-light'
                    "
                  >
                    {{ skill }}
                  </span>
                  }
                </div>
              </div>

              @if (application.coverLetter) {
              <div class="mb-4">
                <h4 class="text-sm font-medium text-foreground-light mb-2">
                  Cover Letter
                </h4>
                <div class="relative">
                  <p class="text-sm text-foreground-light line-clamp-3">
                    {{ application.coverLetter }}
                  </p>
                  <button
                    *ngIf="application.coverLetter.length > 250"
                    (click)="viewFullCoverLetter(application)"
                    class="text-sm text-[var(--color-accent)] hover:underline mt-1"
                  >
                    Read more
                  </button>
                </div>
              </div>
              }

              <div
                class="flex items-center justify-between pt-4 border-t border-foreground-light/20"
              >
                <div class="flex items-center gap-4">
                  <span class="text-sm text-foreground-light">
                    Applied {{ formatDate(application.appliedAt) }}
                  </span>
                  <span class="text-sm text-foreground-light">•</span>
                  <span class="text-sm text-foreground-light">
                    {{ application.job.title }}
                  </span>
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
          }
        </div>
      </div>
    </app-dashboard-layout>

    <!-- Cover Letter Modal -->
    @if (selectedApplication) {
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-[var(--color-background)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-xl font-medium mb-1">
                {{ selectedApplication.applicant.profile.firstName }}
                {{ selectedApplication.applicant.profile.lastName }}
              </h3>
              <p class="text-sm text-foreground-light">
                {{ selectedApplication.job.title }}
              </p>
            </div>
            <button
              (click)="closeModal()"
              class="text-foreground-light hover:text-foreground transition-colors text-xl"
            >
              ×
            </button>
          </div>

          <div class="prose prose-sm max-w-none">
            <h4 class="text-base font-medium mb-2">Cover Letter</h4>
            <div class="whitespace-pre-wrap text-foreground-light">
              {{ selectedApplication.coverLetter }}
            </div>
          </div>
        </div>
      </div>
    </div>
    }

    <!-- Status Update Notification -->
    @if (notification) {
    <div
      class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm animate-fade-in"
      [class]="
        notification.type === 'success'
          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
          : 'bg-red-500/10 text-red-500 border border-red-500/20'
      "
    >
      {{ notification.message }}
    </div>
    }
  `,
})
export class CandidatesComponent implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  isLoading = true;
  currentStatus = 'all';
  currentSort = 'match-desc';
  selectedApplication: JobApplication | null = null;
  notification: { type: 'success' | 'error'; message: string } | null = null;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadAllApplications();
  }

  private async loadAllApplications() {
    try {
      this.isLoading = true;
      this.applications = [];
      this.filteredApplications = [];

      const jobs = await this.jobService.getRecruiterJobs().toPromise();
      console.log('Retrieved jobs:', jobs?.length);

      if (!jobs?.length) {
        console.log('No jobs found for recruiter');
        this.isLoading = false;
        return;
      }

      let totalApplications = 0;
      for (const job of jobs) {
        if (job.status !== 'active') {
          console.log(`Skipping inactive job ${job.id} (${job.status})`);
          continue;
        }

        try {
          const applications = await this.jobService
            .getJobApplications(job.id)
            .toPromise();
          console.log(
            `Retrieved applications for job ${job.id}:`,
            applications?.length
          );

          if (applications?.length) {
            // Filter out applications with incomplete data
            const validApplications = applications.filter((app) => {
              const isValid =
                app?.applicant?.profile &&
                app.status &&
                app.appliedAt &&
                app.matchPercentage !== undefined;

              if (!isValid) {
                console.log('Found invalid application:', app);
              }
              return isValid;
            });

            totalApplications += validApplications.length;
            this.applications.push(...validApplications);
          }
        } catch (error) {
          console.error(`Error loading applications for job ${job.id}:`, error);
        }
      }

      console.log('Total valid applications loaded:', totalApplications);

      this.filterApplications(this.currentStatus);
      this.sortFilteredApplications(this.currentSort);
    } catch (error) {
      console.error('Error loading applications:', error);
      this.showNotification(
        'error',
        'Failed to load candidates. Please try again.'
      );
    } finally {
      this.isLoading = false;
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
      this.filterApplications(this.currentStatus);
      this.sortFilteredApplications(this.currentSort);

      // Show success notification
      this.showNotification(
        'success',
        `Candidate ${status.toLowerCase()} successfully`
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      this.showNotification(
        'error',
        'Failed to update application status. Please try again.'
      );
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

  getInitials(
    profile: { firstName?: string; lastName?: string } | null | undefined
  ): string {
    if (!profile) return '??';
    const first = profile.firstName?.charAt(0) || '?';
    const last = profile.lastName?.charAt(0) || '?';
    return `${first}${last}`.toUpperCase();
  }

  filterByStatus(event: Event) {
    this.currentStatus = (event.target as HTMLSelectElement).value;
    this.filterApplications(this.currentStatus);
    this.sortFilteredApplications(this.currentSort);
  }

  sortApplications(event: Event) {
    this.currentSort = (event.target as HTMLSelectElement).value;
    this.sortFilteredApplications(this.currentSort);
  }

  private filterApplications(status: string = 'all') {
    if (status === 'all') {
      this.filteredApplications = [...this.applications];
    } else {
      this.filteredApplications = this.applications.filter(
        (app) => app.status === status
      );
    }
  }

  private sortFilteredApplications(sortBy: string) {
    switch (sortBy) {
      case 'match-desc':
        this.filteredApplications.sort(
          (a, b) => b.matchPercentage - a.matchPercentage
        );
        break;
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
    }
  }

  isJobRequiredSkill(
    skill: string,
    job: { requiredSkills: string[] }
  ): boolean {
    const normalizedSkill = this.normalizeSkill(skill);
    return job.requiredSkills.some(
      (requiredSkill) => this.normalizeSkill(requiredSkill) === normalizedSkill
    );
  }

  private normalizeSkill(skill: string): string {
    return skill
      .toLowerCase()
      .trim()
      .replace(/[-_. ]+/g, ' ');
  }

  viewFullCoverLetter(application: JobApplication) {
    this.selectedApplication = application;
  }

  closeModal() {
    this.selectedApplication = null;
  }

  private showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
}
