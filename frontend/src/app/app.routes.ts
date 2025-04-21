import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { OnboardingComponent } from './pages/auth/onboarding/onboarding.component';
import { HomeComponent } from './pages/home/home.component';
import { SeekerDashboardComponent } from './pages/dashboard/seeker-dashboard/seeker-dashboard.component';
import { EmployerDashboardComponent } from './pages/dashboard/employer-dashboard/employer-dashboard.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { authGuard } from './shared/guards/auth.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'onboarding', component: OnboardingComponent },
  {
    path: 'dashboard',
    children: [
      {
        path: 'seeker',
        canActivate: [
          authGuard({
            requiredRole: UserRole.JOB_SEEKER,
            redirectTo: '/dashboard/seeker',
          }),
        ],
        children: [
          {
            path: '',
            component: SeekerDashboardComponent,
          },
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: 'jobs',
            loadComponent: () =>
              import('./pages/dashboard/jobs/jobs.component').then(
                (m) => m.JobsComponent
              ),
          },
          {
            path: 'applications',
            loadComponent: () =>
              import(
                './pages/dashboard/applications/applications.component'
              ).then((m) => m.ApplicationsComponent),
          },
        ],
      },
      {
        path: 'employer',
        canActivate: [
          authGuard({
            requiredRole: UserRole.EMPLOYER,
            redirectTo: '/dashboard/employer',
          }),
        ],
        children: [
          {
            path: '',
            component: EmployerDashboardComponent,
          },
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: 'jobs',
            loadComponent: () =>
              import(
                './pages/dashboard/employer-dashboard/job-postings.component'
              ).then((m) => m.JobPostingsComponent),
          },
          {
            path: 'candidates',
            loadComponent: () =>
              import('./pages/dashboard/candidates/candidates.component').then(
                (m) => m.CandidatesComponent
              ),
          },
          {
            path: 'job-posting',
            loadComponent: () =>
              import(
                './pages/dashboard/job-posting/job-posting.component'
              ).then((m) => m.JobPostingComponent),
          },
          {
            path: 'ai-chat',
            loadComponent: () =>
              import('./pages/dashboard/ai-chat/ai-chat.component').then(
                (c) => c.AIChatComponent
              ),
          },
          {
            path: 'jobs/:id',
            loadComponent: () =>
              import(
                './pages/dashboard/job-posting/job-posting.component'
              ).then((m) => m.JobPostingComponent),
          },
          {
            path: 'jobs/:id/applications',
            loadComponent: () =>
              import(
                './pages/dashboard/employer-dashboard/job-applications/job-applications.component'
              ).then((m) => m.JobApplicationsComponent),
          },
        ],
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/terms/terms.component').then((m) => m.TermsComponent),
  },
];
