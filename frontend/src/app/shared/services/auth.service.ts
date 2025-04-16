import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private readonly apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser !== null) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
        console.error('Invalid stored user data:', e);
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ user: User; token: string }>(
          `${this.apiUrl}/auth/login`,
          {
            email,
            password,
          }
        )
      );

      if (response) {
        this.currentUserSubject.next(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.setToken(response.token);
        return response.user;
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
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
    const fullName = `${firstName} ${lastName}`;
    const response = await firstValueFrom(
      this.http.post<{ user: User; token: string }>(
        `${this.apiUrl}/auth/register`,
        {
          name: fullName,
          email,
          password,
          role,
        }
      )
    );

    if (response?.token) {
      this.setToken(response.token);
      this.currentUserSubject.next(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return response.user;
    }
    throw new Error('Registration failed');
  }

  async logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
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
}
