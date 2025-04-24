import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    console.log('Fetching recruiter jobs...');
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/recruiter`).pipe(
      tap((jobs) => {
        console.log('Received recruiter jobs:', jobs?.length || 0);
      }),
      catchError((error) => {
        console.error('Error fetching recruiter jobs:', error);
        return throwError(() => error);
      })
    );
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
    console.log(`Fetching applications for job ${jobId}...`);
    return this.http
      .get<any[]>(`${this.apiUrl}/jobs/${jobId}/applications`)
      .pipe(
        tap((applications) => {
          console.log(
            `Received applications for job ${jobId}:`,
            applications?.length || 0
          );
        }),
        catchError((error) => {
          console.error(`Error fetching applications for job ${jobId}:`, error);
          return throwError(() => error);
        })
      );
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

  applyForJob(jobId: string, data: { coverLetter: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/apply`, data);
  }
}
