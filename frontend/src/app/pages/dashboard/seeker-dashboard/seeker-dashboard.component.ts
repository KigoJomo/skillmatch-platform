import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { DashboardService } from '../../../shared/services/dashboard.service';
import {
  DashboardData,
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
                <img
                  src="/images/profile-placeholder.jpeg"
                  alt="Profile"
                  class="w-24 h-24 rounded-full object-cover z-10"
                />
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
            <h4 class="mb-4">Application Status Overview</h4>
            <!-- Application Status Cards -->

            <div class="grid grid-cols-4 gap-4 mb-8">
              @for (card of dataCards; track card.title) {
              <div
                class="px-4 py-6 rounded-2xl bg-background-light/20 border-2 border-foreground-light/30 text-center"
              >
                <div class="flex justify-between items-center mb-2">
                  <p class="text-sm capitalize text-foreground-light">
                    {{ card.title }}
                  </p>
                </div>
                @if (!card.applications) {
                <p class="text-5xl !text-accent font-semibold">
                  {{ card.value || 0 }}
                </p>
                } @else {
                <div class="text-sm">
                  @for (app of card.applications; track app.job) {
                  <div class="flex justify-between">
                    <span>{{ app.job }}</span>
                    <span>{{ app.status }}</span>
                  </div>
                  }
                </div>
                }
              </div>
              }
            </div>

            <h3 class="text-lg mb-3">Skills Development Progress</h3>
            <!-- Skills Development and Certifications Cards -->
            <div class="grid grid-cols-2 gap-6">
              <!-- Skill Growth Card -->
              <div
                class="p-6 rounded-xl bg-background-light/20 border border-foreground-light/10"
              >
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium">Skill Growth</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold">80%</span>
                    <button class="text-foreground-light/60">...</button>
                  </div>
                </div>
                <div class="h-40 relative">
                  <!-- This is a placeholder for the line chart -->
                  <svg
                    class="w-full h-full"
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,40 180,45 C200,50 220,40 240,45 C260,50 280,40 300,35"
                      stroke="#4ade80"
                      stroke-width="2"
                      fill="none"
                    />
                    <path
                      d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,40 180,45 C200,50 220,40 240,45 C260,50 280,40 300,35 L300,100 L0,100 Z"
                      fill="#4ade80"
                      fill-opacity="0.1"
                    />
                  </svg>
                  <!-- Week labels -->
                  <div
                    class="flex justify-between mt-2 text-xs text-foreground-light"
                  >
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                  </div>
                </div>
              </div>
              <!-- Certifications Card -->
              <div
                class="p-6 rounded-xl bg-background-light/20 border border-foreground-light/10"
              >
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium">Certifications</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold">40%</span>
                    <button class="text-foreground-light/60">...</button>
                  </div>
                </div>
                <div class="h-40 flex items-end justify-between">
                  <!-- Bar chart for monthly progress -->
                  <div class="flex-1 flex items-end h-full">
                    <div
                      class="flex items-end justify-between gap-4 w-full h-5/6"
                    >
                      <div class="w-12 h-[20%] bg-[#4ade80] rounded-t"></div>
                      <div class="w-12 h-[30%] bg-[#4ade80] rounded-t"></div>
                      <div class="w-12 h-[45%] bg-[#4ade80] rounded-t"></div>
                      <div class="w-12 h-[65%] bg-[#4ade80] rounded-t"></div>
                      <div class="w-12 h-[60%] bg-[#4ade80] rounded-t"></div>
                      <div class="w-12 h-[75%] bg-[#4ade80] rounded-t"></div>
                    </div>
                  </div>
                </div>
                <!-- Month labels -->
                <div
                  class="flex items-end justify-between gap-4 w-full mt-2 text-xs text-foreground-light"
                >
                  <span>October</span>
                  <span>May</span>
                  <span>January</span>
                  <span>February</span>
                  <span>July</span>
                  <span>August</span>
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

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadProfileData();
  }

  dataCards = [
    {
      title: 'job matches',
      value: this.dashboardData?.matchCount,
    },
    {
      title: 'applied',
      value: this.dashboardData?.applicationCount,
    },
    {
      title: 'rejected',
      value: this.dashboardData?.rejectedCount,
    },
    {
      title: 'recent activity',
      applications: this.dashboardData?.recentActivity.map((application) => {
        return { job: application.job.title, status: application.status };
      }),
    },
  ];

  private loadDashboardData() {
    this.dashboardService.getJobSeekerDashData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error loading dashboard data: ', error);
      },
    });
  }

  private loadProfileData() {
    this.dashboardService.getProfileData().subscribe({
      next: (data) => {
        this.profileData = data;
      },
      error: (error) => {
        console.error('Error loading Profile data: ', error);
      },
    });
  }
}
