import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applicantCount: number;
  postedDate: string;
  requiredSkills: string[];
}

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
                  <span>{{ job.type }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  [class]="getStatusClasses(job.status)"
                  class="px-2 py-1 rounded-full text-xs capitalize"
                >
                  {{ job.status }}
                </span>
                <app-button size="sm" variant="secondary">Edit</app-button>
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
                <span>{{ job.applicantCount }} applicants</span>
                <span>Posted {{ job.postedDate }}</span>
              </div>
              <div class="flex gap-2">
                <app-button size="sm" variant="secondary"
                  >View Applicants</app-button
                >
                <app-button size="sm" variant="secondary">Share</app-button>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class JobPostingsComponent {
  jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      status: 'active',
      applicantCount: 12,
      postedDate: '2 days ago',
      requiredSkills: ['Angular', 'TypeScript', 'TailwindCSS', 'RxJS'],
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      department: 'Engineering',
      location: 'Hybrid',
      type: 'Full-time',
      status: 'draft',
      applicantCount: 0,
      postedDate: 'Not posted',
      requiredSkills: ['Node.js', 'Angular', 'PostgreSQL', 'Docker'],
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'On-site',
      type: 'Contract',
      status: 'closed',
      applicantCount: 24,
      postedDate: '1 month ago',
      requiredSkills: [
        'Figma',
        'User Research',
        'Prototyping',
        'Design Systems',
      ],
    },
  ];

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
}
