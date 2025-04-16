import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    role?: 'Job Seeker' | 'Employer/Recruiter'
  ): Promise<boolean> {
    if (!this.authService.currentUser) {
      await this.router.navigate(['/login']);
      return false;
    }

    if (role && this.authService.currentUser.role !== role) {
      const correctDashboard =
        this.authService.currentUser.role === 'Job Seeker'
          ? '/dashboard/seeker'
          : '/dashboard/employer';
      await this.router.navigate([correctDashboard]);
      return false;
    }

    if (!this.authService.currentUser.onboardingCompleted) {
      await this.router.navigate(['/onboarding']);
      return false;
    }

    return true;
  }
}
