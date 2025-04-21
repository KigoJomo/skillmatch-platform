import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Profile } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getJobSeekerDashData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/seeker`);
  }

  getEmployerDashData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/employer`);
  }

  getAvailableJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/seeker/jobs`);
  }

  getSeekerApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/seeker/applications`);
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
}
