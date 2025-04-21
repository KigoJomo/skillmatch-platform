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
    return undefined;
  }

  private async navigateToDashboard() {
    if (this.authService.shouldShowOnboarding()) {
      console.log(`>>>>>> Onboarding: ${this.authService.currentUser?.onboardingCompleted}`)
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
      if (error?.status === 400) {
        this.error = 'Invalid email or password';
      } else {
        this.error = 'An error occurred. Please try again later.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
