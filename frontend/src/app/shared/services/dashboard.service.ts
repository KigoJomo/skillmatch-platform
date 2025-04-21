import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getProfileData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  getAvailableJobs(): Observable<any>{
    return this.http.get(`${this.apiUrl}/dashboard/seeker/jobs`)
  }

  getSeekerApplications(): Observable<any>{
    return this.http.get(`${this.apiUrl}/dashboard/seeker/applications`)
  }
}
