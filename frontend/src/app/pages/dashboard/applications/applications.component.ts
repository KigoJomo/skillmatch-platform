import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: string;
  statusClass: string;
  nextSteps: string;
  interviewDate?: string;
  hasMessage: boolean;
  message?: string;
  coverLetter?: string;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterLink, ButtonComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">My Applications</h2>
      </div>

      <div class="container mx-auto">
        @if (isLoading) {
        <app-loader label="Loading applications..." class="py-12" />
        } @else if (applications.length === 0) {
        <div class="flex flex-col items-center justify-center py-12">
          <p class="text-foreground-light">
            You have not applied to any jobs yet.
          </p>
          <app-button
            variant="primary"
            routerLink="/dashboard/jobs"
            class="mt-4"
            >Browse Available Jobs</app-button
          >
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (application of applications; track application.id) {
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 hover:border-[var(--color-accent)] hover:bg-background-light/40 transition-all duration-200 cursor-pointer h-full flex flex-col"
            (click)="openApplicationDetails(application)"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4
                  class="text-lg font-medium mb-1 line-clamp-1"
                  title="{{ application.jobTitle }}"
                >
                  {{ application.jobTitle }}
                </h4>
                <div
                  class="flex flex-wrap items-center gap-2 text-sm text-foreground-light"
                >
                  <span
                    class="line-clamp-1"
                    title="{{ application.company }}"
                    >{{ application.company }}</span
                  >
                  <span>•</span>
                  <span
                    class="line-clamp-1"
                    title="{{ application.location }}"
                    >{{ application.location }}</span
                  >
                </div>
              </div>
              <span
                [class]="
                  'px-3 py-1 rounded-full text-sm shrink-0 ' +
                  application.statusClass
                "
              >
                {{ application.status }}
              </span>
            </div>

            <div class="space-y-2 text-sm mt-2 flex-grow">
              <div class="flex items-start gap-2">
                <span class="text-foreground-light font-medium shrink-0"
                  >Next:</span
                >
                <span class="line-clamp-2">{{ application.nextSteps }}</span>
              </div>

              @if (application.interviewDate) {
              <div class="flex items-center gap-2">
                <span class="text-foreground-light font-medium"
                  >Interview:</span
                >
                <span class="text-[var(--color-accent)]">{{
                  application.interviewDate
                }}</span>
              </div>
              }
            </div>

            <div
              class="flex items-center justify-between mt-4 pt-3 border-t border-foreground-light/10"
            >
              <span class="text-xs text-foreground-light"
                >Applied {{ application.appliedDate }}</span
              >

              @if (application.hasMessage) {
              <button
                class="text-[var(--color-accent)] text-sm hover:underline flex items-center gap-1"
                (click)="showMessage(application, $event)"
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
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  ></path>
                </svg>
                Message
              </button>
              }
            </div>
          </div>
          }
        </div>
        }
      </div>
    </div>

    <!-- Application Details Modal -->
    @if (selectedApplication) {
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-[var(--color-background)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">
              {{ selectedApplication.jobTitle }}
            </h3>
            <button
              class="p-2 rounded-full hover:bg-background-light/30"
              (click)="closeModal()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Application details -->
            <div class="flex flex-wrap gap-3">
              <span
                class="px-3 py-1 rounded-full text-sm {{
                  selectedApplication.statusClass
                }}"
              >
                {{ selectedApplication.status }}
              </span>
              <span
                class="px-3 py-1 rounded-full text-sm bg-background-light text-foreground-light"
              >
                Applied {{ selectedApplication.appliedDate }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-foreground-light">
                  Company
                </h4>
                <p>{{ selectedApplication.company }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-foreground-light">
                  Location
                </h4>
                <p>{{ selectedApplication.location }}</p>
              </div>
            </div>

            @if (selectedApplication.coverLetter) {
            <div>
              <h4 class="text-sm font-medium text-foreground-light mb-2">
                Your Cover Letter
              </h4>
              <div class="bg-background-light/20 p-4 rounded-lg text-sm">
                {{ selectedApplication.coverLetter }}
              </div>
            </div>
            }

            <div>
              <h4 class="text-sm font-medium text-foreground-light mb-2">
                Application Status
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="font-medium">Status:</span>
                  <span
                    class="{{
                      selectedApplication.statusClass.replace('text-sm', '')
                    }}"
                  >
                    {{ selectedApplication.status }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-medium">Next Steps:</span>
                  <span>{{ selectedApplication.nextSteps }}</span>
                </div>
                @if (selectedApplication.interviewDate) {
                <div class="flex items-center gap-2">
                  <span class="font-medium">Interview Date:</span>
                  <span class="text-[var(--color-accent)]">{{
                    selectedApplication.interviewDate
                  }}</span>
                </div>
                }
              </div>
            </div>

            @if (showingMessage) {
            <div class="border-t border-foreground-light/10 pt-4 mt-4">
              <h4 class="text-sm font-medium text-foreground-light mb-2">
                Message from Employer
              </h4>
              <div class="bg-background-light/20 p-4 rounded-lg text-sm">
                <p>
                  {{
                    selectedApplication.message ||
                      "Thank you for your application. We'll be in touch soon regarding next steps."
                  }}
                </p>
              </div>
            </div>
            }

            <div class="flex justify-end gap-4 mt-6">
              @if (selectedApplication.hasMessage && !showingMessage) {
              <app-button variant="secondary" (click)="showingMessage = true"
                >View Message</app-button
              >
              }
              <app-button
                variant="primary"
                [routerLink]="['/dashboard/seeker/jobs']"
                >Browse More Jobs</app-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = false;
  selectedApplication: Application | null = null;
  showingMessage = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  private loadApplications(): void {
    this.isLoading = true;
    this.dashboardService.getSeekerApplications().subscribe({
      next: (data) => {
        this.applications = data.map((app: any) => ({
          ...app,
          appliedDate: this.formatDate(app.appliedDate),
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      },
    });
  }

  openApplicationDetails(application: Application): void {
    this.selectedApplication = { ...application };
    this.showingMessage = false;
  }

  showMessage(application: Application, event: Event): void {
    event.stopPropagation();
    this.selectedApplication = { ...application };
    this.showingMessage = true;
  }

  closeModal(): void {
    this.selectedApplication = null;
    this.showingMessage = false;
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  }
}
