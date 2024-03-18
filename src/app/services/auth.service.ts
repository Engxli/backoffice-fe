// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorageService } from '../utils/storage';
import { LoginResponse } from '../models/LoginResponse';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private instance: ApiService) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  login(email: string, password: string) {
    return this.instance
      .post<LoginResponse>('/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap({
          next: (response) => {
            StorageService.storeToken(response.token);
          },
        })
      );
  }
}
