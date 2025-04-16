import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Exclude login/register endpoints from token injection if they are part of the same API
    if (
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/register')
    ) {
      console.log(
        `[AuthInterceptor] Skipping token for auth request: ${request.url}`
      );
      return next.handle(request);
    }

    const token = this.authService.getToken();
    console.log(
      `[AuthInterceptor] Request URL: ${request.url}, Token retrieved: ${
        token ? 'Exists' : 'NULL'
      }`
    );

    if (token) {
      console.log('[AuthInterceptor] Adding Authorization header');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.warn(
        '[AuthInterceptor] No token found for request, Authorization header not added.'
      );
    }

    return next.handle(request);
  }
}
