import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[var(--color-background)]">
      
      <main class="max-w-7xl mx-auto px-4 py-8">
        <ng-content></ng-content>
      </main>
    </div>
  `,
})
export class DashboardLayoutComponent {
  constructor(public authService: AuthService) {}
}
