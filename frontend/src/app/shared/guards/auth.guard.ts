import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, UserRole } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export interface AuthGuardConfig {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export const authGuard: (config?: AuthGuardConfig) => CanActivateFn = (
  config?: AuthGuardConfig
) => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.routerState.snapshot.url }
          });
          return false;
        }

        if (config?.requiredRole && user.role !== config.requiredRole) {
          const redirectPath = config.redirectTo || getDashboardByRole(user.role);
          router.navigate([redirectPath]);
          return false;
        }

        if (!user.onboardingCompleted) {
          router.navigate(['/onboarding']);
          return false;
        }

        return true;
      })
    );
  };
};

const getDashboardByRole = (role: UserRole): string => {
  return role === 'Job Seeker' ? '/dashboard/seeker' : '/dashboard/employer';
};