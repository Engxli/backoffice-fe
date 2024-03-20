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

  getCustomers<T>(
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string,
    name?: string,
    number?: string,
    ageFrom?: string,
    ageTo?: string,
    dobFrom?: string,
    dobTo?: string
  ) {
    const params = {
      page,
      pageSize,
      sortBy,
      sortOrder,
      name: name ?? '',
      number: number ?? '',
      ageFrom: ageFrom ?? '',
      ageTo: ageTo ?? '',
      dobFrom: dobFrom ?? '',
      dobTo: dobTo ?? '',
    };

    return this.instance.get<T>(`/api/customers`, params);
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
