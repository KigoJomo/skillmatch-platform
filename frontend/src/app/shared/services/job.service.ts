import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job, JobListing } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createJob(jobData: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs`, jobData);
  }

  getRecruiterJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/recruiter`);
  }

  getJobDetails(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${jobId}`);
  }

  updateJob(jobId: string, jobData: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/jobs/${jobId}`, jobData);
  }

  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${jobId}`);
  }

  updateJobStatus(
    jobId: string,
    status: 'draft' | 'active' | 'closed'
  ): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/jobs/${jobId}/status`, {
      status,
    });
  }

  getJobApplications(jobId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs/${jobId}/applications`);
  }

  updateApplicationStatus(
    jobId: string,
    applicationId: string,
    status: 'Pending' | 'Accepted' | 'Rejected'
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/jobs/${jobId}/applications/${applicationId}/status`,
      { status }
    );
  }
}
