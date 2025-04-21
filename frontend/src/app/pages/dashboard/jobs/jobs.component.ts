import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { JobListing } from '../../../shared/interfaces/dashboard.interface';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="">Available Jobs</h2>
      </div>

      <div class="md:mx-40 flex flex-col gap-4">
        <div
          *ngFor="let job of jobs; trackBy: trackByJobId"
          class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="!font-light mb-1">{{ job.title }}</h4>
              <div class="flex items-center gap-4 text-foreground-light">
                <span>{{ job.company }}</span>
                <span>•</span>
                <span>{{ job.location }}</span>
                <span>•</span>
                <span>{{ job.matchPercentage }} % match.</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[var(--color-accent)] text-sm"
                >{{ job.matchPercentage }}% Match</span
              >
              <app-button size="sm">Apply Now</app-button>
            </div>
          </div>
          <p class="text-foreground-light mb-4">{{ job.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let skill of job.requiredSkills"
              class="px-2 py-1 text-xs rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class JobsComponent implements OnInit {
  searchControl = new FormControl('');
  jobs: JobListing[] = [];

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadJobsData();
  }

  private loadJobsData() {
    this.dashboardService.getAvailableJobs().subscribe({
      next: (data) => {
        this.jobs = data
      },
      error: (error) => {
        console.error('Error loading jobs data: ', error);
      },
    })
  }

  searchJobs() {
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (!searchTerm) {
      this.loadJobsData();
      return;
    }

    this.jobs = this.jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.requiredSkills.some((skill) =>
          skill.toLowerCase().includes(searchTerm)
        )
    );
  }

  trackByJobId(index: number, job: any): number {
    return job.id;
  }
}
