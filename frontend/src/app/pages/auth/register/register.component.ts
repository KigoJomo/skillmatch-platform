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
import { AuthService } from '../../../shared/services/auth.service';
import { UserRole } from '../../../shared/interfaces/dashboard.interface';

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
        acceptTerms: [false, [Validators.requiredTrue]],
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
    const control = this.registerForm.get(field);
    if (!control) return undefined;

    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }
    if (control.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    if (field === 'acceptTerms' && control.hasError('requiredTrue')) {
      return 'You must accept the terms and conditions';
    }
    return undefined;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isLoading = true;
    this.error = null;

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
    } catch (error: any) {
      if (error?.status === 400) {
        this.error = 'Email is already registered';
      } else {
        this.error = 'Registration failed. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
