import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../services/auth.service';

export const authGuard = (requiredRole?: UserRole) => {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const user = authService.currentUser;

    if (!user) {
      await router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      const correctDashboard =
        user.role === 'Job Seeker'
          ? '/dashboard/seeker'
          : '/dashboard/employer';
      await router.navigate([correctDashboard]);
      return false;
    }

    return true;
  };
};
