import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // Adjust path if needed
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { UserProfile } from '../../shared/services/auth.service';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Use environment variable
  private tokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  // Assuming UserProfile includes onboarding status
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    console.log('[AuthService] Initializing. Loading current user.');
    this.loadCurrentUser(); // Load user data on service initialization
  }

  // Method to decode token and update subjects
  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        // Check if token is expired
        const expiry = decodedToken.exp * 1000;
        if (Date.now() >= expiry) {
          console.log('[AuthService] Token expired, removing.');
          this.removeToken();
        } else {
          console.log('[AuthService] Token loaded and decoded:', decodedToken);
          this.currentUserSubject.next(decodedToken);
          // Optionally fetch full profile if needed immediately
          // this.fetchUserProfile().subscribe();
        }
      } catch (error) {
        console.error('[AuthService] Error decoding token:', error);
        this.removeToken(); // Remove invalid token
      }
    } else {
      console.log('[AuthService] No token found in storage.');
      this.currentUserSubject.next(null);
      this.userProfileSubject.next(null);
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token;
  }

  setToken(token: string): void {
    console.log('[AuthService] setToken() called.');
    if (!token) {
      console.error('[AuthService] setToken called with null or empty token!');
      return;
    }
    localStorage.setItem(this.tokenKey, token);
    console.log(
      `[AuthService] Token set in localStorage. Key: ${this.tokenKey}`
    );
    this.loadCurrentUser(); // Decode the new token immediately
  }

  removeToken(): void {
    console.log('[AuthService] removeToken() called.');
    localStorage.removeItem(this.tokenKey);
    // Also clear related user data if stored separately, e.g., localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.userProfileSubject.next(null);
  }

  // Example Login Method (Ensure logging exists in your actual login/register)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          console.log('[AuthService] Login successful, setting token.');
          this.setToken(response.token);
          // After setting token and loading user, fetch profile
          this.fetchUserProfile().subscribe({
            // Fetch profile after login
            next: (profile) => {
              console.log(
                '[AuthService] User profile fetched after login:',
                profile
              );
              // Navigation logic should ideally be handled in the component
              // after login success, based on profile status.
              // Example: Check profile.onboardingComplete and navigate
            },
            error: (err) =>
              console.error(
                '[AuthService] Failed to fetch profile after login:',
                err
              ),
          });
        } else {
          console.warn('[AuthService] Login response did not contain a token.');
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        this.removeToken();
        return throwError(() => error);
      })
    );
  }

  // Fetch user profile (example implementation)
  fetchUserProfile(): Observable<UserProfile> {
    console.log('[AuthService] fetchUserProfile() called.');
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`).pipe(
      // Assuming GET /api/profile exists
      tap((profile) => {
        console.log('[AuthService] User profile fetched:', profile);
        this.userProfileSubject.next(profile);
      }),
      catchError((error) => {
        console.error('[AuthService] Failed to fetch user profile:', error);
        this.userProfileSubject.next(null); // Clear profile on error
        return throwError(() => error);
      })
    );
  }

  completeOnboarding(profileData: UserProfile): Observable<UserProfile> {
    console.log(
      '[AuthService] completeOnboarding() called. Sending POST to /api/profile'
    );
    return this.http
      .post<UserProfile>(`${this.apiUrl}/profile`, profileData)
      .pipe(
        tap((profile) => {
          console.log(
            '[AuthService] Onboarding completed, profile updated:',
            profile
          );
          this.userProfileSubject.next(profile); // Update profile state
        }),
        catchError((error) => {
          console.error('[AuthService] completeOnboarding failed:', error);
          return throwError(() => error);
        })
      );
  }

  skipOnboarding(): Observable<UserProfile> {
    console.log(
      '[AuthService] skipOnboarding() called. Sending PATCH to /api/profile/onboarding'
    );
    return this.http
      .patch<UserProfile>(`${this.apiUrl}/profile/onboarding`, {})
      .pipe(
        tap((profile) => {
          console.log(
            '[AuthService] Onboarding skipped, profile updated:',
            profile
          );
          this.userProfileSubject.next(profile); // Update profile state
        }),
        catchError((error) => {
          console.error('[AuthService] skipOnboarding failed:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    console.log('[AuthService] logout() called.');
    this.removeToken();
    // Navigate to login page or home page
    this.router.navigate(['/login']); // Or appropriate route
  }

  // Helper to get current user value synchronously (use with caution)
  get currentUserValue(): DecodedToken | null {
    return this.currentUserSubject.value;
  }

  // Helper to get current profile value synchronously (use with caution)
  get userProfileValue(): UserProfile | null {
    return this.userProfileSubject.value;
  }
}
