import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import {
  DashboardService,
  EmployerDashboardData,
  EmployerAnalytics,
} from '../../../shared/services/dashboard.service';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';

interface MetricGrowth {
  postedJobsGrowth: number;
  applicationsGrowth: number;
  activeJobsGrowth: number;
  hiresGrowth: number;
}

interface ChartDataPoint {
  x: number;
  y: number;
  month: string;
  value: number;
}

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    LoaderComponent,
    RouterLink,
  ],
  template: `
    <app-dashboard-layout>
      <div class="p-6 max-w-full overflow-x-hidden">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">Employer Dashboard</h2>
        </div>

        <div *ngIf="isLoading; else dashboardContent">
          <app-loader label="Loading dashboard data..." class="py-12" />
        </div>

        <ng-template #dashboardContent>
          
          <!-- Metrics Overview -->
          <div class="mb-8">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2"
            >
              <div
                class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20 transition duration-300 hover:border-foreground-light/30 hover:shadow-sm"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm text-foreground-light">Posted Jobs</h5>
                  <span
                    *ngIf="metrics.postedJobsGrowth !== 0"
                    [class]="getGrowthClass(metrics.postedJobsGrowth)"
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {{ getGrowthText(metrics.postedJobsGrowth) }}
                  </span>
                </div>
                <p class="text-2xl font-semibold">
                  {{ dashboardData?.metrics?.postedJobs ?? 0 }}
                </p>
                <a
                  routerLink="/dashboard/employer/job-postings"
                  class="text-xs text-foreground-light hover:underline block mt-2"
                  >View all jobs</a
                >
              </div>
              <div
                class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20 transition duration-300 hover:border-foreground-light/30 hover:shadow-sm"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm text-foreground-light">Applications</h5>
                  <span
                    *ngIf="metrics.applicationsGrowth !== 0"
                    [class]="getGrowthClass(metrics.applicationsGrowth)"
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {{ getGrowthText(metrics.applicationsGrowth) }}
                  </span>
                </div>
                <p class="text-2xl font-semibold">
                  {{ dashboardData?.metrics?.totalApplications ?? 0 }}
                </p>
                <a
                  routerLink="/dashboard/employer/candidates"
                  class="text-xs text-foreground-light hover:underline block mt-2"
                  >View all applications</a
                >
              </div>
              <div
                class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20 transition duration-300 hover:border-foreground-light/30 hover:shadow-sm"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm text-foreground-light">Active Jobs</h5>
                  <span
                    *ngIf="metrics.activeJobsGrowth !== 0"
                    [class]="getGrowthClass(metrics.activeJobsGrowth)"
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {{ getGrowthText(metrics.activeJobsGrowth) }}
                  </span>
                </div>
                <p class="text-2xl font-semibold">
                  {{ dashboardData?.metrics?.activeJobs ?? 0 }}
                </p>
                <div
                  *ngIf="
                    (dashboardData?.metrics?.activeJobs ?? 0) > 0 &&
                    (dashboardData?.metrics?.postedJobs ?? 0) > 0
                  "
                  class="text-xs text-foreground-light mt-2"
                >
                  {{ getActiveJobsPercentage() }}% of total jobs
                </div>
              </div>
              <div
                class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20 transition duration-300 hover:border-foreground-light/30 hover:shadow-sm"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm text-foreground-light">Hires</h5>
                  <span
                    *ngIf="metrics.hiresGrowth !== 0"
                    [class]="getGrowthClass(metrics.hiresGrowth)"
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {{ getGrowthText(metrics.hiresGrowth) }}
                  </span>
                </div>
                <p class="text-2xl font-semibold">
                  {{ dashboardData?.metrics?.totalHires ?? 0 }}
                </p>
                <div
                  *ngIf="
                    analytics?.hiringMetrics?.averageTimeToHire !== undefined
                  "
                  class="text-xs text-foreground-light mt-2"
                >
                  Avg time to hire:
                  {{
                    formatTimeToHire(
                      analytics?.hiringMetrics?.averageTimeToHire ?? 0
                    )
                  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Hiring Trends -->
          <div class="mb-8">
            <h3 class="text-xl font-medium mb-4">Hiring Trends</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Applications Chart -->
              <div
                class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
              >
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <h4 class="text-lg font-medium">Application Trends</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-2xl font-semibold">{{
                        totalApplications
                      }}</span>
                      <span
                        *ngIf="applicationGrowth !== 0"
                        [class]="getGrowthClass(applicationGrowth)"
                        class="text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {{ getGrowthText(applicationGrowth) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-sm text-foreground-light">
                    Last {{ dashboardData?.hiringActivity?.length || 0 }} months
                  </div>
                </div>
                <!-- Area Chart -->
                <div class="h-[200px] relative">
                  <svg
                    *ngIf="chartData.length > 0"
                    class="w-full h-full"
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                  >
                    <!-- Grid lines -->
                    <line
                      *ngFor="let line of chartGridLines"
                      [attr.x1]="0"
                      [attr.y1]="line"
                      [attr.x2]="300"
                      [attr.y2]="line"
                      stroke="var(--color-foreground-light)"
                      stroke-opacity="0.1"
                      stroke-width="1"
                    />

                    <!-- Line chart -->
                    <path
                      [attr.d]="chartPath"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      stroke-linejoin="round"
                      fill="none"
                    />

                    <!-- Area below line -->
                    <path
                      [attr.d]="areaPath"
                      fill="var(--color-accent)"
                      fill-opacity="0.1"
                    />

                    <!-- Data points -->
                    <circle
                      *ngFor="let point of chartData"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="3"
                      fill="var(--color-accent)"
                    >
                      <title>{{ point.month }}: {{ point.value }}</title>
                    </circle>
                  </svg>

                  <div
                    *ngIf="chartData.length === 0"
                    class="h-full flex items-center justify-center text-foreground-light"
                  >
                    No activity data available
                  </div>

                  <!-- Month labels -->
                  <div
                    *ngIf="chartData.length > 0"
                    class="absolute bottom-[-20px] left-0 w-full flex justify-between text-xs text-foreground-light"
                  >
                    <span *ngFor="let point of chartData">
                      {{ point.month }}
                    </span>
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
                <div
                  *ngIf="dashboardData?.recentActivity?.length; else noActivity"
                  class="space-y-4"
                >
                  <div
                    *ngFor="let activity of dashboardData?.recentActivity"
                    class="p-3 border border-foreground-light/10 rounded-lg hover:border-foreground-light/20 transition-colors"
                  >
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="!text-foreground font-medium capitalize">{{ activity.candidateName }}</p>
                        <p class="text-sm text-foreground-light">
                          {{ activity.jobTitle }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p
                          class="text-sm px-2 py-0.5 rounded-full inline-block"
                          [class]="getStatusColor(activity.status)"
                        >
                          {{ activity.status }}
                        </p>
                        <p class="text-xs text-foreground-light mt-1">
                          {{ formatDate(activity.date) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ng-template #noActivity>
                  <div
                    class="text-center text-foreground-light py-8 border border-dashed border-foreground-light/10 rounded-lg"
                  >
                    <p>No recent activity to display</p>
                    <p class="text-sm mt-2">
                      Applications will appear here once candidates apply to
                      your jobs
                    </p>
                  </div>
                </ng-template>
              </div>
            </div>
          </div>

          <!-- Analytics Overview -->
          <div class="mb-8">
            <h3 class="text-xl font-medium mb-4">Hiring Analytics</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Application Funnel -->
              <div
                class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 md:col-span-1"
              >
                <h4 class="text-lg font-medium mb-4">Application Funnel</h4>
                <div
                  *ngIf="analytics?.applicationFunnel?.length; else noFunnel"
                  class="space-y-4"
                >
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

                  <div
                    *ngIf="
                      analytics?.hiringMetrics?.applicationSuccessRate !==
                      undefined
                    "
                    class="pt-4 border-t border-foreground-light/10 mt-4 text-sm"
                  >
                    <div class="flex justify-between items-center mb-2">
                      <span>Success Rate:</span>
                      <span class="font-medium"
                        >{{
                          (
                            analytics?.hiringMetrics?.applicationSuccessRate ??
                            0
                          ).toFixed(1)
                        }}%</span
                      >
                    </div>
                  </div>
                </div>
                <ng-template #noFunnel>
                  <div
                    class="text-center text-foreground-light py-8 border border-dashed border-foreground-light/10 rounded-lg"
                  >
                    <p>No application data available</p>
                  </div>
                </ng-template>
              </div>

              <!-- Top Required Skills -->
              <div
                class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20 md:col-span-2"
              >
                <h4 class="text-lg font-medium mb-4">Top Required Skills</h4>
                <div
                  *ngIf="analytics?.topRequiredSkills?.length; else noSkills"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div *ngFor="let skill of analytics?.topRequiredSkills">
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="truncate mr-2">{{ skill.skill }}</span>
                        <span>{{ skill.count }}</span>
                      </div>
                      <div
                        class="h-2 bg-background-light/30 rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full"
                          [ngClass]="
                            getSkillBarColor(
                              skill,
                              analytics?.topRequiredSkills ?? []
                            )
                          "
                          [style.width.%]="calculateSkillWidth(skill)"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <ng-template #noSkills>
                  <div
                    class="text-center text-foreground-light py-8 border border-dashed border-foreground-light/10 rounded-lg"
                  >
                    <p>No skills data available</p>
                    <p class="text-sm mt-2">
                      Add required skills to your job postings to see trends
                      here
                    </p>
                  </div>
                </ng-template>
              </div>
            </div>
          </div>

        </ng-template>
      </div>
    </app-dashboard-layout>
  `,
})
export class EmployerDashboardComponent implements OnInit, OnDestroy {
  dashboardData?: EmployerDashboardData;
  analytics?: EmployerAnalytics;
  totalApplications = 0;
  applicationGrowth = 0;
  isLoading = true;
  metrics: MetricGrowth = {
    postedJobsGrowth: 0,
    applicationsGrowth: 0,
    activeJobsGrowth: 0,
    hiresGrowth: 0,
  };

  // Chart data
  chartData: ChartDataPoint[] = [];
  chartPath = '';
  areaPath = '';
  chartGridLines = [25, 50, 75]; // Y positions for grid lines at 25%, 50%, 75%

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAnalytics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.dashboardService
      .getEmployerDashData()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error loading dashboard data:', error);
          return [];
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((data) => {
        if (data) {
          this.dashboardData = data;
          this.calculateApplicationMetrics();
          this.calculateMetricsGrowth();
          this.processChartData();
        }
      });
  }

  private loadAnalytics(): void {
    this.dashboardService
      .getEmployerAnalytics()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error loading analytics:', error);
          return [];
        })
      )
      .subscribe((data) => {
        if (data) {
          this.analytics = data;
        }
      });
  }

  private calculateApplicationMetrics(): void {
    if (
      !this.dashboardData?.hiringActivity ||
      this.dashboardData.hiringActivity.length === 0
    ) {
      return;
    }

    const activity = this.dashboardData.hiringActivity;

    if (activity.length >= 2) {
      const current = activity[activity.length - 1].count;
      const previous = activity[activity.length - 2].count;
      this.totalApplications = current;

      if (previous > 0) {
        this.applicationGrowth = Math.round(
          ((current - previous) / previous) * 100
        );
      } else if (current > 0) {
        this.applicationGrowth = 100; // If previous was 0 and current is positive, that's 100% growth
      } else {
        this.applicationGrowth = 0;
      }
    } else if (activity.length === 1) {
      this.totalApplications = activity[0].count;
      this.applicationGrowth = activity[0].count > 0 ? 100 : 0; // New data point is either growth or no change
    }
  }

  private calculateMetricsGrowth(): void {
    if (!this.dashboardData) return;

    // Use actual application growth that was calculated
    this.metrics.applicationsGrowth = this.applicationGrowth;

    // For other metrics, we would ideally have historical data from the API
    // Since we don't have that, we'll estimate based on recent activity

    const recentActivity = this.dashboardData.recentActivity || [];

    // Calculate growth based on whether there are recent hires or not
    const recentHires = recentActivity.filter(
      (activity) =>
        activity.status === 'Accepted' &&
        new Date(activity.date) >= this.getDateDaysAgo(30)
    ).length;

    if (this.dashboardData.metrics.totalHires > 0) {
      // If there are recent hires relative to total, show positive growth
      if (recentHires > 0) {
        this.metrics.hiresGrowth = Math.min(
          Math.round(
            (recentHires / this.dashboardData.metrics.totalHires) * 100
          ),
          100
        );
      } else {
        this.metrics.hiresGrowth = 0; // No recent hires means flat growth
      }
    }

    // Active jobs as a percentage of total posted jobs
    if (this.dashboardData.metrics.postedJobs > 0) {
      const activeJobsRatio =
        this.dashboardData.metrics.activeJobs /
        this.dashboardData.metrics.postedJobs;
      // If more than half the jobs are active, show positive growth, otherwise negative
      this.metrics.activeJobsGrowth = Math.round((activeJobsRatio - 0.5) * 100);
    }

    // Posted jobs growth - check if there are recent job postings (last 30 days)
    const recentJobPostings = (this.dashboardData.openPositions || []).filter(
      (job) => new Date(job.postedDate) >= this.getDateDaysAgo(30)
    ).length;

    if (this.dashboardData.metrics.postedJobs > 0) {
      this.metrics.postedJobsGrowth = Math.min(
        Math.round(
          (recentJobPostings / this.dashboardData.metrics.postedJobs) * 100
        ),
        100
      );
    }
  }

  private getDateDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  private processChartData(): void {
    if (
      !this.dashboardData?.hiringActivity ||
      this.dashboardData.hiringActivity.length === 0
    ) {
      return;
    }

    const activity = this.dashboardData.hiringActivity;
    const maxCount = Math.max(...activity.map((a) => a.count), 1);

    // Process chart data points
    this.chartData = activity.map((a, i) => {
      const x = (i / Math.max(1, activity.length - 1)) * 300;
      const y = 100 - (a.count / maxCount) * 65;
      return {
        x,
        y,
        month: this.formatMonth(a.month),
        value: a.count,
      };
    });

    // Create chart path
    if (this.chartData.length > 0) {
      // Line chart path
      this.chartPath = this.chartData
        .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
        .join(' ');

      // Area chart path (adds bottom border to create closed shape)
      this.areaPath =
        this.chartPath +
        ` L${this.chartData[this.chartData.length - 1].x},100 L0,100 Z`;
    }
  }

  formatMonth(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('default', { month: 'short' });
    } catch (e) {
      return dateStr;
    }
  }

  getGrowthClass(growth: number): string {
    if (growth > 0) return 'bg-green-500/20 text-green-500';
    if (growth < 0) return 'bg-red-500/20 text-red-500';
    return 'bg-foreground-light/20 text-foreground-light';
  }

  getGrowthText(growth: number): string {
    const prefix = growth > 0 ? '+' : '';
    return `${prefix}${growth}%`;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-500/20 text-green-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  }

  getSkillBarColor(
    skill: { count: number },
    allSkills: { count: number }[]
  ): string {
    if (!allSkills.length) return 'bg-purple-500';

    const maxCount = allSkills[0]?.count || 1;
    const ratio = skill.count / maxCount;

    if (ratio > 0.8) return 'bg-green-500';
    if (ratio > 0.5) return 'bg-[var(--color-accent)]';
    if (ratio > 0.3) return 'bg-blue-500';
    return 'bg-purple-500';
  }

  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  }

  formatTimeToHire(days: number): string {
    if (days < 1) return 'Less than a day';
    return `${Math.round(days)} day${days !== 1 ? 's' : ''}`;
  }

  calculateFunnelWidth(stat: { count: number }): number {
    if (!this.analytics?.applicationFunnel) return 0;

    const total =
      this.analytics.applicationFunnel.reduce((sum, s) => sum + s.count, 0) ||
      1;
    return (stat.count / total) * 100;
  }

  calculateSkillWidth(skill: { count: number }): number {
    if (!this.analytics?.topRequiredSkills?.length) return 0;

    const maxCount = Math.max(
      ...this.analytics.topRequiredSkills.map((s) => s.count),
      1
    );
    return (skill.count / maxCount) * 100;
  }

  getActiveJobsPercentage(): number {
    if (!this.dashboardData?.metrics) return 0;

    const { activeJobs, postedJobs } = this.dashboardData.metrics;
    if (!postedJobs || postedJobs === 0) return 0;

    return Math.round((activeJobs / postedJobs) * 100);
  }
}
