import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { LogoComponent } from '../../../shared/ui/logo/logo.component';
import { AuthService, UserRole } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
    LogoComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  roles: UserRole[] = ['Job Seeker', 'Employer/Recruiter'];
  selectedRole: UserRole = 'Job Seeker';
  registerForm: FormGroup;
  isLoading = false;
  showTermsError = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['John'],
      lastName: ['Doe'],
      email: ['register@example.com'],
      password: ['password'],
      companyName: [''],
      acceptTerms: [true],
    });
  }

  getErrorMessage(field: string): string | undefined {
    return undefined; // No validation in development
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      await this.authService.register(
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.selectedRole
      );
      await this.router.navigate(['/onboarding']);
    } finally {
      this.isLoading = false;
    }
  }

  async signUpWithGoogle() {
    // For demo, we'll create a new user with a generated email
    const randomId = Math.random().toString(36).substring(7);
    await this.authService.register(
      'Google',
      'User',
      `google${randomId}@example.com`,
      'password',
      this.selectedRole
    );
    await this.router.navigate(['/onboarding']);
  }

  async signUpWithGithub() {
    // For demo, we'll create a new user with a generated email
    const randomId = Math.random().toString(36).substring(7);
    await this.authService.register(
      'Github',
      'User',
      `github${randomId}@example.com`,
      'password',
      this.selectedRole
    );
    await this.router.navigate(['/onboarding']);
  }
}
