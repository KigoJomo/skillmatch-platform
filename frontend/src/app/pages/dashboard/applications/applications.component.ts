import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../shared/services/dashboard.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="">My Applications</h2>
      </div>

      <div class="md:mx-40 flex flex-col gap-4">
        @for (application of applications; track application.id) {
        <div
          class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="!font-light mb-1">
                {{ application.jobTitle }}
              </h4>
              <div class="flex items-center gap-4 text-foreground-light">
                <span>{{ application.company }}</span>
                <span>•</span>
                <span>{{ application.location }}</span>
                <span>Applied {{ application.appliedDate }}</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span
                [class]="
                  'px-3 py-1 rounded-full text-sm ' + application.statusClass
                "
              >
                {{ application.status }}
              </span>
              <button
                class="text-[var(--color-accent)] hover:underline"
                *ngIf="application.hasMessage"
              >
                View Message
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-foreground-light">Next Steps:</span>
              <span>{{ application.nextSteps }}</span>
            </div>

            @if (application.interviewDate) {
            <div class="flex items-center gap-2">
              <span class="text-foreground-light">Interview:</span>
              <span>{{ application.interviewDate }}</span>
            </div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadApplications();
  }

  private loadApplications() {
    this.dashboardService.getSeekerApplications().subscribe({
      next: (data) => {
        this.applications = data.map((app: any) => ({
          ...app,
          appliedDate: this.formatDate(app.appliedDate),
        }));
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      },
    });
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
