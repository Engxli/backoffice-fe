// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../models/AppRoutes';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // if user already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate([AppRoutes.Dashboard]);
      return false;
    }
    return true;
  }
}
