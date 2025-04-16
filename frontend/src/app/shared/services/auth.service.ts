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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpirationTimer: any;

  private readonly apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    const token = this.getToken();

    if (storedUser !== null && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.setupTokenExpirationTimer(token);
      } catch (e) {
        this.clearAuthData();
        console.error('Invalid stored user data:', e);
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.setupTokenExpirationTimer(token);
  }

  private setupTokenExpirationTimer(token: string): void {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration <= 0) {
        this.clearAuthData();
        return;
      }

      // Clear any existing timer
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }

      // Set new timer
      this.tokenExpirationTimer = setTimeout(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }, timeUntilExpiration);
    } catch (e) {
      console.error('Error setting up token expiration timer:', e);
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  private handleError(error: HttpErrorResponse): never {
    let errorMessage: string;

    if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid credentials';
    } else if (error.status === 401) {
      errorMessage = 'Authentication required. Please log in again.';
      this.clearAuthData();
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network';
    } else {
      errorMessage = 'An unexpected error occurred. Please try again later';
    }

    const enhancedError = new Error(errorMessage) as any;
    enhancedError.status = error.status;
    throw enhancedError;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ user: User; token: string }>(
          `${this.apiUrl}/auth/login`,
          { email, password }
        )
      );

      console.log('Login API Response:', response);

      // Check if response and necessary data exist
      if (response?.token && response.user) {
        // Added check for response.user
        this.currentUserSubject.next(response.user);
        // Store user data correctly
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.setToken(response.token);
        return response.user;
      }
      // Throw a more specific error if data is missing
      console.error('Login failed: Invalid response structure.', response);
      throw new Error('Login failed: Invalid response from server.');
    } catch (error) {
      console.error('Login error:', error); // Log the error
      if (error instanceof HttpErrorResponse) {
        throw this.handleError(error);
      }
      throw error; // Re-throw original or new error
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
      const fullName = `${firstName} ${lastName}`;
      const response = await firstValueFrom(
        this.http.post<{ user: User; token: string }>(
          `${this.apiUrl}/auth/register`,
          { name: fullName, email, password, role }
        )
      );

      if (response?.token) {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
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

  async logout() {
    this.clearAuthData();
    await this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async skipOnboarding(): Promise<void> {
    if (this.currentUser) {
      const updatedUser = { ...this.currentUser, onboardingCompleted: true };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      await firstValueFrom(
        this.http.patch(`${this.apiUrl}/profile/onboarding`, {
          onboardingCompleted: true,
        })
      );
    }
  }

  async completeOnboarding(profileData: UserProfile): Promise<void> {
    if (this.currentUser) {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/profile`, profileData)
      );

      if (response) {
        const updatedUser = { ...this.currentUser, onboardingCompleted: true };
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }

  shouldShowOnboarding(): boolean {
    return this.currentUser ? !this.currentUser.onboardingCompleted : false;
  }

  private loadInitialUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    // Ensure "undefined" string isn't parsed
    if (userJson && userJson !== 'undefined') {
      try {
        const user = JSON.parse(userJson);
        // Add a check to ensure the parsed user is a valid object
        if (user && typeof user === 'object') {
          return user;
        } else {
          console.error('Invalid user data found in localStorage:', userJson);
          localStorage.removeItem('currentUser');
          return null;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        localStorage.removeItem('currentUser');
        return null;
      }
    }
    // If userJson is null or "undefined", remove the item
    if (userJson === 'undefined') {
      localStorage.removeItem('currentUser');
    }
    return null;
  }
}
