import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';

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
            <p class="text-2xl font-semibold">120</p>
          </div>
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Applications</h5>
              <span class="text-xs text-green-500">+10%</span>
            </div>
            <p class="text-2xl font-semibold">450</p>
          </div>
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Interviews</h5>
              <span class="text-xs text-green-500">+2%</span>
            </div>
            <p class="text-2xl font-semibold">30</p>
          </div>
          <div
            class="p-4 rounded-lg bg-background-light/50 border border-foreground-light/20"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-sm text-foreground-light">Hires</h5>
              <span class="text-xs text-green-500">+1%</span>
            </div>
            <p class="text-2xl font-semibold">15</p>
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
                  <span class="text-2xl font-semibold">450</span>
                  <span class="text-xs text-green-500">+10%</span>
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
              <!-- Replace the placeholder divs with an SVG element -->
              <svg
                class="w-full h-full"
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,40 180,45 C200,50 220,40 240,45 C260,50 280,40 300,35"
                  stroke="var(--color-accent)"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,40 180,45 C200,50 220,40 240,45 C260,50 280,40 300,35 L300,100 L0,100 Z"
                  fill="var(--color-accent)"
                  fill-opacity="0.1"
                />
              </svg>
              <!-- Month labels -->
              <div
                class="absolute bottom-[-20px] left-0 w-full flex justify-between text-xs text-foreground-light"
              >
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
              </div>
            </div>
          </div>

          <!-- Hires Chart -->
          <div
            class="p-6 rounded-xl bg-background-light/30 border border-foreground-light/20"
          >
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-lg font-medium">Hires</h4>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-semibold">15</span>
                  <span class="text-xs text-green-500">+1%</span>
                </div>
              </div>
              <button
                class="text-sm text-foreground-light hover:text-[var(--color-accent)]"
              >
                •••
              </button>
            </div>
            <!-- Bar Chart Placeholder -->
            <div class="h-[200px] flex items-end justify-between gap-4 px-4">
              <div
                class="w-8 h-[30%] bg-[var(--color-accent)]/60 rounded-t"
              ></div>
              <div
                class="w-8 h-[45%] bg-[var(--color-accent)]/60 rounded-t"
              ></div>
              <div
                class="w-8 h-[65%] bg-[var(--color-accent)]/60 rounded-t"
              ></div>
              <div
                class="w-8 h-[55%] bg-[var(--color-accent)]/60 rounded-t"
              ></div>
              <div
                class="w-8 h-[80%] bg-[var(--color-accent)]/60 rounded-t"
              ></div>
              <div
                class="w-8 h-[40%] bg-[var(--color-accent)]/60 rounded-t"
              ></div>
            </div>
            <!-- Month labels -->
            <div
              class="mt-2 flex justify-between px-4 text-xs text-foreground-light"
            >
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class EmployerDashboardComponent {}
