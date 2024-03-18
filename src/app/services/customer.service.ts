// src/app/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private instance: ApiService) {}

  getCustomers() {
    return this.instance.get<any[]>(`/api/customers`);
  }

  getCustomerById(id: number) {
    return this.instance.get<any>(`/api/customers/${id}`);
  }

  addCustomer(customer: any) {
    return this.instance.post(`/api/customers`, customer);
  }

  updateCustomer(id: number, customer: any) {
    return this.instance.put(`/api/customers/${id}`, customer);
  }

  deleteCustomer(id: number) {
    return this.instance.delete(`/api/customers/${id}`);
  }
}
