import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'Job Seeker' | 'Employer/Recruiter';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  onboardingCompleted: boolean;
}

export interface UserProfile {
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experienceLevel?: string;
  jobTypes?: string[];
  salaryExpectation?: string;
  preferredLocation?: string;
}

interface JwtPayload {
  exp: number;
  iat: number;
  id: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api';
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadInitialUser()
  );
  currentUser$ = this.currentUserSubject.asObservable();
  currentUser: User | null = this.loadInitialUser();

  constructor(private http: HttpClient, private router: Router) {}

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ user: User; token: string }>(
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
        this.http.post<{ user: User; token: string }>(
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

  async completeOnboarding(profileData: UserProfile): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<Profile>(`${this.apiUrl}/profile`, profileData)
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
    return this.currentUser ? !this.currentUser.onboardingCompleted : false;
  }

  async logout() {
    this.clearAuthData();
    await this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentUser = null;
  }

  private loadInitialUser(): User | null {
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

  private handleError(error: HttpErrorResponse): Error {
    if (error.status === 401) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return new Error('Session expired. Please login again.');
    }
    return new Error(error.error?.error || 'An error occurred');
  }
}
