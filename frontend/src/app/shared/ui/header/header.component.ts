import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent, ButtonComponent],
  template: `
    <header
      class="w-screen sticky top-0 z-50 bg-background border-b border-foreground-light/30"
    >
      <div
        class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6"
      >
        <div class="flex items-center gap-8">
          <a routerLink="/" class="hover:opacity-90">
            <app-logo size="md"></app-logo>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <ng-container
              *ngIf="!(authService.currentUser$ | async); else loggedInNav"
            >
              <a routerLink="/" class="hover:text-[var(--color-accent)]"
                >Home</a
              >
              <a routerLink="/about" class="hover:text-[var(--color-accent)]"
                >About</a
              >
              <a routerLink="/faq" class="hover:text-[var(--color-accent)]"
                >FAQ</a
              >
              <a routerLink="/contact" class="hover:text-[var(--color-accent)]"
                >Contact</a
              >
            </ng-container>

            <ng-template #loggedInNav>
              <ng-container
                *ngIf="
                  (authService.currentUser$ | async)?.role === 'Job Seeker';
                  else employerNav
                "
              >
                <a
                  routerLink="/dashboard/seeker"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >Dashboard</a
                >
                <a
                  routerLink="/dashboard/seeker/jobs"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >Jobs</a
                >
                <a
                  routerLink="/dashboard/seeker/applications"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >Applications</a
                >
              </ng-container>
              <ng-template #employerNav>
                <a
                  routerLink="/dashboard/employer"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >Dashboard</a
                >
                <a
                  routerLink="/dashboard/employer/jobs"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >Job Postings</a
                >
                <a
                  routerLink="/dashboard/employer/candidates"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >Candidates</a
                >
                <a
                  routerLink="/dashboard/employer/ai-chat"
                  routerLinkActive="text-[var(--color-accent)]"
                  class="hover:text-[var(--color-accent)]"
                  >AI Chat</a
                >
              </ng-template>
            </ng-template>
          </nav>
        </div>

        <!-- Auth Buttons/Profile -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle Button -->
          <button
            (click)="toggleTheme()"
            class="flex items-center justify-center w-8 h-8 rounded-full bg-background-light/30 text-foreground hover:text-[var(--color-accent)] transition-colors"
            aria-label="Toggle theme"
          >
            <!-- Sun icon for dark mode (shown when in dark mode to switch to light) -->
            <svg
              *ngIf="currentTheme === 'dark'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <!-- Moon icon for light mode (shown when in light mode to switch to dark) -->
            <svg
              *ngIf="currentTheme === 'light'"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <ng-container
            *ngIf="!(authService.currentUser$ | async); else profileMenu"
          >
            <a routerLink="/register">
              <app-button size="sm" variant="secondary">Sign Up</app-button>
            </a>
            <a routerLink="/login">
              <app-button size="sm" variant="primary">Log In</app-button>
            </a>
          </ng-container>

          <ng-template #profileMenu>
            <div class="flex items-center gap-4">
              <a
                [routerLink]="['/dashboard', getDashboardRoute(), 'profile']"
                class="flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <div
                  class="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-background font-medium"
                >
                  {{ getInitial() }}
                </div>
                <span class="text-sm hidden md:inline">{{
                  (authService.currentUser$ | async)?.firstName
                }}</span>
              </a>
              <app-button size="sm" variant="secondary" (click)="logout()"
                >Sign Out</app-button
              >
            </div>
          </ng-template>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  currentTheme: Theme;

  constructor(
    public authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeService.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  getDashboardRoute(): string {
    return this.authService.currentUser?.role === 'Job Seeker'
      ? 'seeker'
      : 'employer';
  }

  getInitial(): string {
    return this.authService.currentUser?.firstName?.charAt(0) ?? '';
  }

  async logout() {
    await this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
