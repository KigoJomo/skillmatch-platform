import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, User, UserRole } from '../interfaces/dashboard.interface';

interface CurrentUser extends User {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  currentUser: CurrentUser | null = null;

  constructor() {
    const initialUser = this.loadInitialUser();
    if (initialUser) {
      this.currentUser = initialUser;
      this.currentUserSubject.next(initialUser);
    }

    // Delay the refresh to avoid circular dependency during initialization
    setTimeout(() => {
      if (this.hasValidToken()) {
        this.refreshCurrentUser().catch((error) => {
          console.error('Failed to refresh user data:', error);
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.clearAuthData();
          }
        });
      } else if (this.getRawToken()) {
        this.clearAuthData();
      }
    }, 0);
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ user: CurrentUser; token: string }>(
          `${this.apiUrl}/auth/login`,
          { email, password }
        )
      );

      if (response?.token) {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
        this.currentUser = response.user;
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return response.user;
      }
      throw new Error('Login failed');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ user: CurrentUser; token: string }>(
          `${this.apiUrl}/auth/register`,
          { firstName, lastName, email, password, role }
        )
      );

      if (response?.token) {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
        this.currentUser = response.user;
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return response.user;
      }
      throw new Error('Registration failed');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  async completeOnboarding(profileData: Profile): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<Profile>(
          `${this.apiUrl}/profile/onboarding`,
          profileData
        )
      );

      if (response && this.currentUser) {
        const updatedUser = { ...this.currentUser, onboardingCompleted: true };
        this.currentUserSubject.next(updatedUser);
        this.currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  async skipOnboarding(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.apiUrl}/profile/onboarding`, {})
      );

      if (this.currentUser) {
        const updatedUser = { ...this.currentUser, onboardingCompleted: true };
        this.currentUserSubject.next(updatedUser);
        this.currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  shouldShowOnboarding(): boolean {
    let showOnboarding = true;
    if (this.currentUser) {
      if (this.currentUser.onboardingCompleted) {
        showOnboarding = false;
      } else {
        showOnboarding = true;
      }
    }
    return showOnboarding;
    // return this.currentUser ? !this.currentUser.onboardingCompleted : false;
  }

  async logout() {
    this.clearAuthData();
    await this.router.navigate(['/']);
  }

  private getRawToken(): string | null {
    return localStorage.getItem('token');
  }

  getToken(): string | null {
    if (!this.hasValidToken()) {
      this.clearAuthData();
      return null;
    }
    return this.getRawToken();
  }

  private hasValidToken(): boolean {
    const token = this.getRawToken();
    if (!token) return false;

    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return false;

    return Date.now() < parseInt(expiration) * 1000;
  }

  private setToken(token: string): void {
    const tokenData = this.parseJwt(token);
    if (tokenData && tokenData.exp) {
      localStorage.setItem('token_expiration', tokenData.exp.toString());
    }
    localStorage.setItem('token', token);
  }

  private parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentUser = null;
  }

  private loadInitialUser(): CurrentUser | null {
    const userJson = localStorage.getItem('currentUser');

    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  async updateCurrentUser(userData: Partial<CurrentUser>): Promise<void> {
    if (this.currentUser) {
      const updatedUser = { ...this.currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      this.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }

  async refreshCurrentUser(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<CurrentUser>(`${this.apiUrl}/auth/me`)
      );

      if (response) {
        this.currentUserSubject.next(response);
        this.currentUser = response;
        localStorage.setItem('currentUser', JSON.stringify(response));
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse): Error {
    if (error.status === 401) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return new Error('Session expired. Please login again.');
    }
    return new Error(error.error?.error || 'An error occurred');
  }
}
