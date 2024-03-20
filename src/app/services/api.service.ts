import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = 'https://backoffice-api.turguta.com';

  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any) {
    return this.http.get<T>(this.baseURL + url, { params });
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(this.baseURL + url, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(this.baseURL + url, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.baseURL + url);
  }
}
