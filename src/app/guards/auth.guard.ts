// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../models/AppRoutes';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // if user is not logged in, redirect to login page
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([AppRoutes.Login]);
      return false;
    }
    return true;
  }
}
