import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CustomersResponse } from '../../models/CutomersResponse';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  dataSource: { data: any[]; totalItems: number } = { data: [], totalItems: 0 };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortBy: string = 'id'; // Default sorting column
  sortOrder: string = 'ASC'; // Default sorting order

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService
      .getCustomers<CustomersResponse>(
        this.currentPage,
        this.itemsPerPage,
        this.sortBy,
        this.sortOrder
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.dataSource.totalItems = response.totalItems;
        },
        error: (error) => {
          console.error('There was an error loading customers:', error);
        },
      });
  }

  updateCustomer(customerId: number): void {
    this.router.navigate(['/update-customer', customerId]);
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  sort(property: string): void {
    if (this.sortBy === property) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = property;
      this.sortOrder = 'ASC';
    }
    this.loadCustomers();
  }
  setItemsPerPage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Type assertion
    const value = selectElement.value;
    this.itemsPerPage = Number(value);
    this.currentPage = 1; // Reset to the first page
    this.loadCustomers();
  }
}
