import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { LogoComponent } from '../../../shared/ui/logo/logo.component';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
    LogoComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [true],
    });
  }

  getErrorMessage(field: string): string | undefined {
    const control = this.loginForm.get(field);
    // Only show errors if the field has been touched or the form was submitted
    if (!control || (!control.touched && !this.formSubmitted)) {
      return undefined;
    }

    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }
    return undefined;
  }

  private async navigateToDashboard() {
    if (this.authService.shouldShowOnboarding()) {
      console.log(
        `>>>>>> Onboarding: ${this.authService.currentUser?.onboardingCompleted}`
      );
      await this.router.navigate(['/onboarding']);
      return;
    }

    const dashboardType =
      this.authService.currentUser?.role === 'Job Seeker'
        ? 'seeker'
        : 'employer';
    await this.router.navigate([`/dashboard/${dashboardType}`]);
  }

  async onSubmit() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      await this.navigateToDashboard();
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 400:
            this.error = 'Invalid email or password';
            break;
          case 401:
            this.error = 'Unauthorized access. Please check your credentials.';
            break;
          case 403:
            this.error =
              'Your account has been suspended. Please contact support.';
            break;
          case 404:
            this.error =
              'Account not found. Please check your email or register.';
            break;
          case 429:
            this.error = 'Too many login attempts. Please try again later.';
            break;
          case 0:
            this.error =
              'Unable to connect to the server. Please check your internet connection.';
            break;
          default:
            this.error =
              error.error?.message ||
              'An error occurred. Please try again later.';
        }
      } else {
        this.error =
          error.message || 'An error occurred. Please try again later.';
      }

      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
