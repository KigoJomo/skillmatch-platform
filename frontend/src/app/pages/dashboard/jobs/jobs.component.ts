import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
                <span>{{ job.type }}</span>
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
export class JobsComponent {
  searchControl = new FormControl('');

  searchJobs() {
    // TODO: Implement search functionality
    console.log('Searching for:', this.searchControl.value);
  }

  jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-time',
      matchPercentage: 95,
      description:
        'We are seeking an experienced frontend developer to join our dynamic team...',
      requiredSkills: ['Angular', 'TypeScript', 'TailwindCSS', 'RxJS'],
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'InnovateSoft',
      location: 'New York, NY',
      type: 'Full-time',
      matchPercentage: 88,
      description:
        'Looking for a full stack developer with strong experience in modern web technologies...',
      requiredSkills: ['Node.js', 'Angular', 'PostgreSQL', 'Docker'],
    },
    {
      id: 3,
      title: 'UI/UX Developer',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Contract',
      matchPercentage: 85,
      description:
        'Join our creative team to build beautiful and intuitive user interfaces...',
      requiredSkills: ['Angular', 'SCSS', 'Figma', 'User Testing'],
    },
  ];

  trackByJobId(index: number, job: any): number {
    return job.id;
  }
}
