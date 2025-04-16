import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'Job Seeker' | 'Employer/Recruiter';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  onboardingCompleted?: boolean;
  profile?: UserProfile;
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

interface SimulatedUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  // Simulated user database
  private readonly mockUsers: SimulatedUser[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'seeker@example.com',
      password: 'password',
      role: 'Job Seeker',
      onboardingCompleted: false,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'employer@example.com',
      password: 'password',
      role: 'Employer/Recruiter',
      onboardingCompleted: false,
    },
    {
      firstName: 'Dev',
      lastName: 'User',
      email: 'dev@example.com',
      password: 'password',
      role: 'Job Seeker',
      onboardingCompleted: false,
    },
  ];

  constructor(private router: Router) {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async login(email: string, password: string) {
    // Simulate API call to find user
    const user = this.mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create a new user object without the password
    this.currentUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      profile: user.profile,
    };

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) {
    // In a real app, this would make an API call to create the user
    const newUser: SimulatedUser = {
      firstName,
      lastName,
      email,
      password,
      role,
      onboardingCompleted: false,
    };

    // In development, we'll just log in the user directly
    this.currentUser = {
      firstName,
      lastName,
      email,
      role,
      onboardingCompleted: false,
    };

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    await this.router.navigate(['/']);
  }

  async skipOnboarding() {
    if (this.currentUser) {
      this.currentUser.onboardingCompleted = true;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  async completeOnboarding(profileData: UserProfile) {
    if (this.currentUser) {
      this.currentUser.onboardingCompleted = true;
      this.currentUser.profile = profileData;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }
}
