import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { DashboardService } from '../../../shared/services/dashboard.service';
import {
  DashboardData,
  DataCardInterface,
  Profile,
} from '../../../shared/interfaces/dashboard.interface';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-seeker-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout>
      <div class="w-full flex flex-col">
        <div class="md:mx-20 px-20 pb-40 border-x border-background-light">
          <!-- Profile Header with Skyline -->
          <div class="relative">
            <div
              class="h-64 bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden rounded-2xl"
            >
              <img
                src="/images/skyline.jpeg"
                alt="City skyline"
                class="w-full h-full object-cover opacity-100 z-[8]"
              />
            </div>
            <div class="flex flex-col items-center -mt-12">
              <div class="rounded-full border-4 border-background">
                <div
                  class="w-18 aspect-square rounded-full bg-[var(--color-accent)] capitalize flex items-center justify-center text-background-light/70 font-medium text-4xl"
                >
                  {{ getInitial() }}
                </div>
              </div>
              <h3 class="font-semibold">
                {{ profileData?.firstName }} {{ profileData?.lastName }}
              </h3>
              <div
                class="flex items-center gap-4 text-sm text-foreground-light mt-1"
              >
                <span>{{ authService.currentUser?.email }}</span>
              </div>
            </div>
          </div>

          <div class="px-6 mt-8">
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-xl font-medium">Application Status Overview</h4>
            </div>
            <!-- Application Status Cards -->

            <div class="grid grid-cols-4 gap-6 mb-8">
              @for (card of dataCards; track card.title) {
              <div
                class="p-4 rounded-2xl bg-background-light/20 border border-foreground-light/10 hover:border-foreground-light/30 transition-colors flex flex-col group"
              >
                <div class="flex justify-between items-center mb-3">
                  <p
                    class="text-sm capitalize text-foreground-light font-medium"
                  >
                    {{ card.title }}
                  </p>
                </div>
                @if (!card.applications) {
                <p
                  class="text-7xl !text-accent/30 group-hover:!text-accent font-semibold w-fit ml-auto mt-auto transition-all duration-300"
                >
                  {{ card.value }}
                </p>
                } @else {
                <div
                  class="text-sm space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground-light/10 hide-scrollbar"
                >
                  @for (app of card.applications; track app.job) {
                  <div
                    class="flex justify-between items-center py-1"
                    title="{{ app.job }}"
                  >
                    <span class="truncate mr-4 text-xs">{{ app.job }}</span>
                    <span
                      class="shrink-0 px-2 py-0.5 rounded-full text-[.5rem]"
                      [class]="
                        app.status === 'Accepted'
                          ? 'bg-green-500/20 text-green-500'
                          : app.status === 'Rejected'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      "
                    >
                      {{ app.status }}
                    </span>
                  </div>
                  }
                </div>
                }
              </div>
              }
            </div>

            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-medium">Skills Development Progress</h3>
            </div>
            <!-- Skills Development and Certifications Cards -->
            <div class="grid grid-cols-2 gap-6">
              <!-- Skills Development Card -->
              <div
                class="p-6 rounded-xl bg-background-light/20 border border-foreground-light/10 hover:border-foreground-light/30 transition-colors"
              >
                <div class="flex items-center justify-between mb-6">
                  <h4 class="font-medium">Skills Overview</h4>
                  <div class="flex items-center gap-3">
                    <span class="text-2xl font-bold text-[var(--color-accent)]"
                      >{{ skillMatchData.percentage }}%</span
                    >
                    <div class="flex flex-col">
                      <span class="text-xs text-foreground-light">Overall</span>
                      <span class="text-sm font-medium">Match Rate</span>
                    </div>
                  </div>
                </div>
                <div
                  class="space-y-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-foreground-light/10 hover:scrollbar-thumb-foreground-light/20"
                >
                  @for (skill of skillMatchData.skills; track skill.name) {
                  <div>
                    <div class="flex justify-between text-sm mb-1.5">
                      <span>{{ skill.name }}</span>
                      <span class="text-foreground-light"
                        >{{ skill.percentage }}%</span
                      >
                    </div>
                    <div
                      class="h-1.5 bg-background-light/30 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-[var(--color-accent)]"
                        [style.width.%]="skill.percentage"
                      ></div>
                    </div>
                  </div>
                  }
                </div>
              </div>

              <!-- Suggested Skills Card -->
              <div
                class="p-6 rounded-xl bg-background-light/20 border border-foreground-light/10 hover:border-foreground-light/30 transition-colors"
              >
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium">Suggested Skills</h4>
                </div>
                <div class="space-y-2">
                  <div class="p-3 rounded-lg bg-background-light/30">
                    <p class="font-medium">
                      Based on your rejected applications:
                    </p>
                    <p class="text-sm text-foreground-light mt-1">
                      These skills appeared most in jobs where you weren't
                      selected
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-4">
                    @for (skill of skillMatchData.suggestedSkills; track skill)
                    {
                    <span
                      class="px-3 py-1 text-sm rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    >
                      {{ skill }}
                    </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Weekly Growth Card -->
              <div
                class="col-span-2 p-6 rounded-xl bg-background-light/20 border border-foreground-light/10 hover:border-foreground-light/30 transition-colors"
              >
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium">Weekly Match Performance</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-foreground-light"
                      >Last 8 Weeks</span
                    >
                  </div>
                </div>
                <div class="h-40 relative">
                  <svg
                    class="w-full h-full"
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      [attr.d]="generateGrowthPath()"
                      stroke="#4ade80"
                      stroke-width="2"
                      fill="none"
                    />
                    <path
                      [attr.d]="generateGrowthAreaPath()"
                      fill="#4ade80"
                      fill-opacity="0.1"
                    />
                  </svg>
                  <div
                    class="flex justify-between mt-2 text-xs text-foreground-light"
                  >
                    @for (point of skillMatchData.growth; track point.week) {
                    <span>Week {{ point.week }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-dashboard-layout>
  `,
  styles: [
    `
      :host {
        --chart-color: #4ade80;
        --bar-color: #22c55e;
      }
    `,
  ],
})
export class SeekerDashboardComponent implements OnInit {
  profileData: Profile | null = null;
  dashboardData: DashboardData | null = null;
  skillMatchData: {
    percentage: number;
    skills: Array<{ name: string; percentage: number }>;
    growth: { week: number; value: number }[];
    suggestedSkills: string[];
  } = {
    percentage: 0,
    skills: [],
    growth: [],
    suggestedSkills: [],
  };

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadProfileData();
  }

  dataCards: DataCardInterface[] = [
    {
      title: 'job matches',
      value: 0,
    },
    {
      title: 'applied',
      value: 0,
    },
    {
      title: 'rejected',
      value: 0,
    },
    {
      title: 'recent activity',
      applications: [],
    },
  ];

  private loadDashboardData() {
    this.dashboardService.getJobSeekerDashData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateDataCards();
        this.calculateSkillProgress();
      },
      error: (error) => {
        console.error('Error loading dashboard data: ', error);
      },
    });
  }

  private calculateSkillProgress() {
    if (this.dashboardData?.recentActivity && this.profileData?.skills) {
      // Calculate overall skill match percentage
      const totalOpportunities =
        this.dashboardData.applicationCount + this.dashboardData.matchCount;
      const matchPercentage =
        (this.dashboardData.matchCount / Math.max(1, totalOpportunities)) * 100;
      this.skillMatchData.percentage = Math.min(
        100,
        Math.max(0, Math.round(matchPercentage))
      );

      // Calculate individual skill match percentages
      this.skillMatchData.skills = this.profileData.skills.map((skill) => {
        // Count matches and total opportunities for this specific skill
        const skillStats = this.dashboardData!.recentActivity.reduce(
          (acc, activity) => {
            // Check if the job has required skills and if this skill is required
            if (activity.job?.requiredSkills?.includes(skill)) {
              acc.total++;
              if (activity.status === 'Accepted') {
                acc.matches++;
              }
            }
            return acc;
          },
          { matches: 0, total: 0 }
        );

        // Calculate percentage based on matches vs total applications where skill was required
        const skillPercentage =
          skillStats.total > 0
            ? Math.round((skillStats.matches / skillStats.total) * 100)
            : this.skillMatchData.percentage; // Use overall match rate if no specific data for skill

        return {
          name: skill,
          percentage: skillPercentage,
        };
      });

      // Calculate weekly performance for 2 months (8 weeks)
      const now = new Date();
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Group matches by week
      const weeklyMatches = this.dashboardData.recentActivity.reduce(
        (acc, activity) => {
          const activityDate = new Date(activity.appliedAt);
          if (activityDate >= twoMonthsAgo) {
            const weekNumber = Math.floor(
              (now.getTime() - activityDate.getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            );
            acc[weekNumber] =
              (acc[weekNumber] || 0) + (activity.status === 'Accepted' ? 1 : 0);
          }
          return acc;
        },
        {} as Record<number, number>
      );

      // Convert to array format for chart - show last 8 weeks
      this.skillMatchData.growth = Array.from({ length: 8 }, (_, i) => ({
        week: i + 1,
        value: weeklyMatches[i] || 0,
      }));

      // Calculate suggested skills based on rejected applications
      const rejectedSkills = new Set<string>();
      this.dashboardData.recentActivity
        .filter((app) => app.status === 'Rejected' && app.job.requiredSkills)
        .forEach((app) => {
          app.job.requiredSkills.forEach((skill) => {
            if (!this.profileData?.skills?.includes(skill)) {
              rejectedSkills.add(skill);
            }
          });
        });

      this.skillMatchData.suggestedSkills = Array.from(rejectedSkills).slice(
        0,
        3
      );
    }
  }

  private updateDataCards() {
    if (this.dashboardData) {
      this.dataCards = [
        {
          title: 'job matches',
          value: this.dashboardData.matchCount,
        },
        {
          title: 'applied',
          value: this.dashboardData.applicationCount,
        },
        {
          title: 'rejected',
          value: this.dashboardData.rejectedCount,
        },
        {
          title: 'recent activity',
          applications: this.dashboardData.recentActivity.map((activity) => ({
            job: activity.job.title,
            status: activity.status,
          })),
        },
      ];
    }
  }

  private loadProfileData() {
    this.dashboardService.getProfileData().subscribe({
      next: (data) => {
        this.profileData = data;
        if (this.dashboardData) {
          this.calculateSkillProgress();
        }
      },
      error: (error) => {
        console.error('Error loading Profile data: ', error);
      },
    });
  }

  generateGrowthPath(): string {
    if (!this.skillMatchData.growth.length) return '';

    const maxValue = Math.max(
      ...this.skillMatchData.growth.map((g) => g.value)
    );
    const points = this.skillMatchData.growth.map((g, i) => {
      const x = (i / 7) * 300; // 8 points spread across width
      const y = maxValue ? 100 - (g.value / maxValue) * 65 : 35;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    });

    return points.join(' ');
  }

  generateGrowthAreaPath(): string {
    if (!this.skillMatchData.growth.length) return '';
    return this.generateGrowthPath() + ' L300,100 L0,100 Z';
  }

  getInitial(): string {
    return this.authService.currentUser?.firstName?.charAt(0) ?? '';
  }
}
