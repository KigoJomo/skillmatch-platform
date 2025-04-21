import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Profile } from '../interfaces/dashboard.interface';

export interface EmployerDashboardData {
  metrics: {
    postedJobs: number;
    totalApplications: number;
    totalHires: number;
    activeJobs: number;
  };
  recentActivity: {
    id: string;
    candidateName: string;
    jobTitle: string;
    status: string;
    date: string;
  }[];
  hiringActivity: {
    count: number;
    month: string;
  }[];
  openPositions: {
    id: string;
    title: string;
    applicantCount: number;
    department: string;
    postedDate: string;
  }[];
}

export interface EmployerAnalytics {
  applicationFunnel: {
    status: string;
    count: number;
  }[];
  topRequiredSkills: {
    skill: string;
    count: number;
  }[];
  hiringMetrics: {
    averageTimeToHire: number;
    applicationSuccessRate: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getJobSeekerDashData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/seeker`);
  }

  getEmployerDashData(): Observable<EmployerDashboardData> {
    return this.http.get<EmployerDashboardData>(
      `${this.apiUrl}/dashboard/employer`
    );
  }

  getEmployerAnalytics(): Observable<EmployerAnalytics> {
    return this.http.get<EmployerAnalytics>(
      `${this.apiUrl}/dashboard/employer/analytics`
    );
  }

  getAvailableJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/available-jobs`);
  }

  getSeekerApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/applications`);
  }

  getProfileData(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profile`);
  }

  getUserProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/profile/projects`);
  }

  updateProfile(profile: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/profile`, profile);
  }

  addProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/profile/projects`, project);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/profile/projects/${projectId}`
    );
  }
}
