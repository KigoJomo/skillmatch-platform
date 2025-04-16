import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
    this.registerForm = this.fb.nonNullable.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        companyName: [''],
        acceptTerms: [true],
      },
      {
        validators: RegisterComponent.passwordMatchValidator,
      }
    );
  }

  private static passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword || !password.value) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };

  getErrorMessage(field: string): string | undefined {
    if (field === 'confirmPassword') {
      if (this.registerForm.get('confirmPassword')?.hasError('required')) {
        return 'Password confirmation is required';
      }
      if (
        this.registerForm.get('confirmPassword')?.hasError('passwordMismatch')
      ) {
        return 'Passwords do not match';
      }
    }
    return undefined; // No validation in development
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const user = await this.authService.register(
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.selectedRole
      );
      if (!user.onboardingCompleted) {
        await this.router.navigate(['/onboarding']);
      } else {
        const dashboardType =
          user.role === 'Job Seeker' ? 'seeker' : 'employer';
        await this.router.navigate([`/dashboard/${dashboardType}`]);
      }
    } catch (error) {
      this.error = 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async signUpWithGoogle() {
    try {
      const user = await this.authService.register(
        'Google',
        'User',
        `google${Math.random().toString(36).substring(7)}@example.com`,
        'password',
        this.selectedRole
      );
      if (!user.onboardingCompleted) {
        await this.router.navigate(['/onboarding']);
      } else {
        const dashboardType =
          user.role === 'Job Seeker' ? 'seeker' : 'employer';
        await this.router.navigate([`/dashboard/${dashboardType}`]);
      }
    } catch (error) {
      this.error = 'Registration failed. Please try again.';
    }
  }

  async signUpWithGithub() {
    try {
      const user = await this.authService.register(
        'Github',
        'User',
        `github${Math.random().toString(36).substring(7)}@example.com`,
        'password',
        this.selectedRole
      );
      if (!user.onboardingCompleted) {
        await this.router.navigate(['/onboarding']);
      } else {
        const dashboardType =
          user.role === 'Job Seeker' ? 'seeker' : 'employer';
        await this.router.navigate([`/dashboard/${dashboardType}`]);
      }
    } catch (error) {
      this.error = 'Registration failed. Please try again.';
    }
  }
}
