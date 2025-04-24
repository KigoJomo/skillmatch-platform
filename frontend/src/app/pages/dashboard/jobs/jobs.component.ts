import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { JobService } from '../../../shared/services/job.service';
import { JobListing } from '../../../shared/interfaces/dashboard.interface';
import { ApplicationModalComponent } from '../../../shared/ui/application-modal/application-modal.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    ApplicationModalComponent,
    LoaderComponent,
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Available Jobs</h2>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label
              for="matchThreshold"
              class="text-xs text-foreground-light whitespace-nowrap"
            >
              Min Skills Match: {{ matchThreshold }}%
            </label>
            <input
              id="matchThreshold"
              type="range"
              [formControl]="matchThresholdControl"
              min="0"
              max="100"
              step="10"
              class="w-32 accent-[var(--color-accent)]"
              (input)="applyFilters()"
            />
          </div>
          <div class="w-64">
            <input
              [formControl]="searchControl"
              (input)="applyFilters()"
              type="search"
              placeholder="Search jobs..."
              class="w-full px-4 py-2 rounded-md border bg-background-light/20 border-[var(--color-foreground-light)]/20
                   text-[var(--color-foreground)] placeholder-[var(--color-foreground-light)]/50
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      <div *ngIf="isLoading">
        <app-loader label="Loading available jobs..." class="py-12" />
      </div>
      <div *ngIf="!isLoading">
        <div
          *ngIf="filteredJobs.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <p class="text-foreground-light">
            No jobs found matching your search criteria.
          </p>
          <p *ngIf="matchThreshold > 0" class="text-foreground-light mt-2">
            Try lowering the minimum match percentage.
          </p>
        </div>
        <div
          *ngIf="filteredJobs.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            *ngFor="let job of filteredJobs; trackBy: trackByJobId"
            class="group relative p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 hover:border-[var(--color-accent)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4
                  class="text-lg font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors"
                >
                  {{ job.title }}
                </h4>
                <div
                  class="flex items-center gap-3 text-sm text-foreground-light"
                >
                  <span>{{ job.company }}</span>
                  <span>•</span>
                  <span>{{ job.location }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span
                  class="px-3 py-1 rounded-full text-sm bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  >{{ job.matchPercentage }}% Match</span
                >
              </div>
            </div>

            <p class="text-foreground-light mb-4 line-clamp-3">
              {{ job.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-6">
              <span
                *ngFor="let skill of job.requiredSkills"
                class="px-2 py-1 text-xs rounded-full bg-background-light hover:bg-[var(--color-accent)]/5 transition-colors"
              >
                {{ skill }}
              </span>
            </div>

            <div
              class="flex items-center justify-between border-t border-foreground-light/10 pt-4"
            >
              <div
                class="flex items-center gap-4 text-sm text-foreground-light"
              >
                <span>{{ job.employmentType }}</span>
                <span>•</span>
                <span>{{ job.salaryRange }}</span>
              </div>
              <app-button size="sm" (click)="openApplicationModal(job)">
                Apply Now
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-application-modal
      [isOpen]="showApplicationModal"
      [job]="selectedJob!"
      (closeModal)="closeApplicationModal()"
      (submitApplication)="submitApplication($event)"
      *ngIf="showApplicationModal && selectedJob"
    ></app-application-modal>
  `,
})
export class JobsComponent implements OnInit {
  searchControl = new FormControl('');
  matchThresholdControl = new FormControl(10);
  allJobs: JobListing[] = []; // Store all jobs
  filteredJobs: JobListing[] = []; // Store filtered jobs
  showApplicationModal = false;
  selectedJob: JobListing | null = null;
  isLoading = false;
  matchThreshold = 10;

  constructor(
    private jobService: JobService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadJobsData();
    this.matchThresholdControl.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.matchThreshold = value;
        this.applyFilters();
      }
    });
  }

  private loadJobsData() {
    this.isLoading = true;
    this.dashboardService.getAvailableJobs().subscribe({
      next: (data) => {
        this.allJobs = data;
        this.filteredJobs = [...this.allJobs];
        this.applyFilters(); // Apply initial filters
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs data: ', error);
        this.isLoading = false;
      },
    });
  }

  openApplicationModal(job: JobListing) {
    this.selectedJob = job;
    this.showApplicationModal = true;
  }

  closeApplicationModal() {
    this.showApplicationModal = false;
    this.selectedJob = null;
  }

  async submitApplication(data: { coverLetter: string }) {
    if (!this.selectedJob) return;

    try {
      await this.jobService.applyForJob(this.selectedJob.id, data).toPromise();
      alert('Application submitted successfully!');
      // Refresh the jobs list to update any state
      this.loadJobsData();
      this.closeApplicationModal();
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const threshold = this.matchThreshold;

    this.filteredJobs = this.allJobs.filter(
      (job) =>
        job.matchPercentage >= threshold &&
        (searchTerm === '' ||
          job.title.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(searchTerm)
          ))
    );
  }

  trackByJobId(_: number, job: JobListing): string {
    return job.id;
  }
}
