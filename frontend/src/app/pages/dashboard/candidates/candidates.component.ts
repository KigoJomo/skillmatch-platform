import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';

interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  skills: string[];
  matchScore: number;
  status: 'new' | 'screening' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: string;
}

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent, ButtonComponent],
  template: `
    <app-dashboard-layout>
      <div class="px-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="">Candidate Management</h2>
        </div>

        <!-- Candidate List -->
        <div class="md:px-12 flex flex-col gap-6">
          @for (candidate of candidates; track candidate.id) {
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
                  <h3 class="font-medium">{{ candidate.name }}</h3>
                  <p class="text-sm text-foreground-light">
                    {{ candidate.role }}
                  </p>
                  <p class="text-sm text-foreground-light">
                    {{ candidate.experience }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="px-2 py-1 rounded-full"
                  [class]="getStatusClasses(candidate.status)"
                >
                  {{ candidate.status }}
                </span>
                <span
                  class="px-2 py-1 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                >
                  {{ candidate.matchScore }}% Match
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              @for (skill of candidate.skills; track skill) {
              <span class="px-2 py-1 rounded-full bg-background-light text-xs">
                {{ skill }}
              </span>
              }
            </div>

            <div
              class="flex items-center justify-between pt-4 border-t border-foreground-light/20"
            >
              <span class="text-sm text-foreground-light">
                Applied {{ candidate.appliedDate }}
              </span>
              <div class="flex gap-2">
                <app-button size="sm" variant="secondary">
                  View Profile
                </app-button>
                <app-button size="sm" variant="primary">
                  Schedule Interview
                </app-button>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-6">
          <div class="flex gap-2">
            <app-button size="sm" variant="primary" class="w-8 h-8 !p-0">
              1
            </app-button>
            <app-button size="sm" variant="secondary" class="w-8 h-8 !p-0">
              2
            </app-button>
            <app-button size="sm" variant="secondary" class="w-8 h-8 !p-0">
              3
            </app-button>
            <app-button size="sm" variant="secondary" class="w-8 h-8 !p-0">
              <span class="sr-only">Next</span>
              →
            </app-button>
          </div>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class CandidatesComponent {
  candidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Senior Frontend Developer',
      experience: '5 years experience',
      skills: ['React', 'TypeScript', 'Node.js'],
      matchScore: 95,
      status: 'new',
      appliedDate: '2 days ago',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Frontend Developer',
      experience: '3 years experience',
      skills: ['Angular', 'JavaScript', 'CSS'],
      matchScore: 88,
      status: 'screening',
      appliedDate: '3 days ago',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Lead Frontend Developer',
      experience: '7 years experience',
      skills: ['React', 'Vue', 'TypeScript', 'Node.js'],
      matchScore: 92,
      status: 'interviewing',
      appliedDate: '1 week ago',
    },
  ];

  getStatusClasses(status: string): string {
    const baseClasses = 'text-xs capitalize';
    switch (status) {
      case 'new':
        return `${baseClasses} bg-blue-500/20 text-blue-500`;
      case 'screening':
        return `${baseClasses} bg-yellow-500/20 text-yellow-500`;
      case 'interviewing':
        return `${baseClasses} bg-[var(--color-accent)]/20 text-[var(--color-accent)]`;
      case 'offered':
        return `${baseClasses} bg-green-500/20 text-green-500`;
      case 'rejected':
        return `${baseClasses} bg-red-500/20 text-red-500`;
      default:
        return baseClasses;
    }
  }
}
