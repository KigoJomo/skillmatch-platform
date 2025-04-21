import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import {
  DashboardService,
  EmployerDashboardData,
  EmployerAnalytics,
} from '../../../shared/services/dashboard.service';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout>
      <div class="p-6 md:mx-20 px-20 pb-40 border-x border-background-light">
        <!-- Metrics Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Posted Jobs</h5>
              <span class="text-xs text-green-500">+5%</span>
            </div>
            <p class="text-2xl font-semibold">
              {{ dashboardData?.metrics?.postedJobs ?? 0 }}
            </p>
          </div>
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Applications</h5>
              <span class="text-xs text-green-500">+10%</span>
            </div>
            <p class="text-2xl font-semibold">
              {{ dashboardData?.metrics?.totalApplications ?? 0 }}
            </p>
          </div>
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Active Jobs</h5>
              <span class="text-xs text-green-500">+2%</span>
            </div>
            <p class="text-2xl font-semibold">
              {{ dashboardData?.metrics?.activeJobs ?? 0 }}
            </p>
          </div>
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Hires</h5>
              <span class="text-xs text-green-500">+1%</span>
            </div>
            <p class="text-2xl font-semibold">
              {{ dashboardData?.metrics?.totalHires ?? 0 }}
            </p>
          </div>
        </div>

        <!-- Hiring Trends -->
        <h3 class="text-xl font-medium mb-4">Hiring Trends</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Applications Chart -->
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
          >
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-lg font-medium">Applications</h4>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-semibold">{{
                    totalApplications
                  }}</span>
                  <span class="text-xs text-green-500"
                    >+{{ applicationGrowth }}%</span
                  >
                </div>
              </div>
              <button
                class="text-sm text-foreground-light hover:text-[var(--color-accent)]"
              >
                •••
              </button>
            </div>
            <!-- Area Chart Placeholder -->
            <div class="h-[200px] relative">
              <svg
                class="w-full h-full"
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
              >
                <path
                  [attr.d]="
                    generateChartPath(dashboardData?.hiringActivity || [])
                  "
                  stroke="var(--color-accent)"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  [attr.d]="
                    generateAreaPath(dashboardData?.hiringActivity || [])
                  "
                  fill="var(--color-accent)"
                  fill-opacity="0.1"
                />
              </svg>
              <!-- Month labels -->
              <div
                class="absolute bottom-[-20px] left-0 w-full flex justify-between text-xs text-foreground-light"
              >
                <span *ngFor="let month of getLastThreeMonths()">{{
                  month
                }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
          >
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-medium">Recent Activity</h4>
            </div>
            <div class="space-y-4">
              <div *ngFor="let activity of dashboardData?.recentActivity">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">{{ activity.candidateName }}</p>
                    <p class="text-sm text-foreground-light">
                      {{ activity.jobTitle }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p
                      class="text-sm"
                      [class]="getStatusColor(activity.status)"
                    >
                      {{ activity.status }}
                    </p>
                    <p class="text-xs text-foreground-light">
                      {{ formatDate(activity.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Application Funnel -->
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
          >
            <h4 class="text-lg font-medium mb-4">Application Funnel</h4>
            <div class="space-y-4">
              <div *ngFor="let stat of analytics?.applicationFunnel">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ stat.status }}</span>
                    <span>{{ stat.count }}</span>
                  </div>
                  <div
                    class="h-2 bg-background-light/30 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-[var(--color-accent)]"
                      [style.width.%]="calculateFunnelWidth(stat)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Required Skills -->
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
          >
            <h4 class="text-lg font-medium mb-4">Top Required Skills</h4>
            <div class="space-y-4">
              <div *ngFor="let skill of analytics?.topRequiredSkills">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ skill.skill }}</span>
                    <span>{{ skill.count }}</span>
                  </div>
                  <div
                    class="h-2 bg-background-light/30 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-[var(--color-accent)]"
                      [style.width.%]="calculateSkillWidth(skill)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class EmployerDashboardComponent implements OnInit {
  dashboardData?: EmployerDashboardData;
  analytics?: EmployerAnalytics;
  totalApplications = 0;
  applicationGrowth = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadAnalytics();
  }

  private async loadDashboardData() {
    try {
      this.dashboardData = await this.dashboardService
        .getEmployerDashData()
        .toPromise();
      this.calculateApplicationMetrics();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  private async loadAnalytics() {
    try {
      this.analytics = await this.dashboardService
        .getEmployerAnalytics()
        .toPromise();
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  private calculateApplicationMetrics() {
    if (this.dashboardData?.hiringActivity) {
      const activity = this.dashboardData.hiringActivity;
      if (activity.length >= 2) {
        const current = activity[activity.length - 1].count;
        const previous = activity[activity.length - 2].count;
        this.totalApplications = current;
        this.applicationGrowth = previous
          ? Math.round(((current - previous) / previous) * 100)
          : 0;
      }
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return '';
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
    return d.toLocaleDateString();
  }

  generateChartPath(activity: { count: number; month: string }[]): string {
    if (!activity.length) return '';

    const maxCount = Math.max(...activity.map((a) => a.count));
    const points = activity.map((a, i) => {
      const x = (i / (activity.length - 1)) * 300;
      const y = 100 - (a.count / maxCount) * 65;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    });

    return points.join(' ');
  }

  generateAreaPath(activity: { count: number; month: string }[]): string {
    if (!activity.length) return '';

    const maxCount = Math.max(...activity.map((a) => a.count));
    const points = activity.map((a, i) => {
      const x = (i / (activity.length - 1)) * 300;
      const y = 100 - (a.count / maxCount) * 65;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    });

    return points.join(' ') + ` L300,100 L0,100 Z`;
  }

  getLastThreeMonths(): string[] {
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleString('default', { month: 'short' }));
    }
    return months;
  }

  calculateFunnelWidth(stat: { count: number }): number {
    const total =
      this.analytics?.applicationFunnel.reduce((sum, s) => sum + s.count, 0) ||
      0;
    return total ? (stat.count / total) * 100 : 0;
  }

  calculateSkillWidth(skill: { count: number }): number {
    const maxCount = this.analytics?.topRequiredSkills[0]?.count || 0;
    return maxCount ? (skill.count / maxCount) * 100 : 0;
  }
}
