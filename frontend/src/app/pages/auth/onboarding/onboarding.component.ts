import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { SeekerOnboardingComponent } from './seeker-onboarding/seeker-onboarding.component';
import { RecruiterOnboardingComponent } from './recruiter-onboarding/recruiter-onboarding.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    SeekerOnboardingComponent,
    RecruiterOnboardingComponent,
  ],
  template: `
    @if (authService.currentUser?.role === 'Job Seeker') {
    <app-seeker-onboarding />
    } @else if (authService.currentUser?.role === 'Employer/Recruiter') {
    <app-recruiter-onboarding />
    }
  `,
})
export class OnboardingComponent implements OnInit {
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.currentUser) {
      this.router.navigate(['/login']);
    }
  }
}
