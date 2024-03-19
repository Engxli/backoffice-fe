import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CustomersResponse } from '../../models/CutomersResponse';
import { AppRoutes } from '../../models/AppRoutes';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  dataSource: { data: any[]; totalItems: number } = { data: [], totalItems: 0 };
  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortBy: string = 'id'; // Default sorting column
  sortOrder: string = 'ASC'; // Default sorting order
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  search: string = '';
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.has('itemsPerPage')) {
        const itemsPerPage = Number(params.get('itemsPerPage'));
        if (
          itemsPerPage > 0 &&
          this.itemsPerPageOptions.includes(itemsPerPage)
        ) {
          this.itemsPerPage = itemsPerPage;
        }
      }

      if (params.has('sortBy')) {
        const sortBy = params.get('sortBy');
        if (sortBy) {
          this.sortBy = sortBy;
        }
      }

      if (params.has('sortOrder')) {
        const sortOrder = params.get('sortOrder');
        if (sortOrder) {
          this.sortOrder = sortOrder;
        }
      }

      if (params.has('page')) {
        const page = Number(params.get('page'));
        const maxPage = Math.ceil(
          this.dataSource.totalItems / this.itemsPerPage
        );
        if (page > 0 && page <= maxPage) {
          this.currentPage = page;
        } else {
          this.navigateWithMergedParams(AppRoutes.Dashboard, {
            page: 1,
          });
        }
      }

      if (params.has('search')) {
        const search = params.get('search');
        if (search) {
          this.search = search;
        }
      } else {
        this.search = '';
      }
    });

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService
      .getCustomers<CustomersResponse>(
        this.currentPage,
        this.itemsPerPage,
        this.sortBy,
        this.sortOrder,
        this.search,
        this.search
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

  loadCustomersWithSearch(search: string): void {
    this.customerService
      .getCustomers<CustomersResponse>(
        this.currentPage,
        this.itemsPerPage,
        this.sortBy,
        this.sortOrder,
        search,
        search
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

  setPage(page: number): void {
    this.currentPage = page;
    this.navigateWithMergedParams(AppRoutes.Dashboard, {
      page: this.currentPage,
    });
    this.loadCustomers();
  }

  sort(property: string): void {
    if (this.sortBy === property) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = property;
      this.sortOrder = 'ASC';
    }
    this.navigateWithMergedParams(AppRoutes.Dashboard, {
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    });
    this.loadCustomers();
  }

  setItemsPerPage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Type assertion
    const value = selectElement.value;
    this.itemsPerPage = Number(value);
    this.currentPage = 1; // Reset to the first page
    this.navigateWithMergedParams(AppRoutes.Dashboard, {
      itemsPerPage: this.itemsPerPage,
      page: this.currentPage,
    });
    this.loadCustomers();
  }

  addCustomer(): void {
    // add query parameter to the URL new = true
    this.navigateWithMergedParams(AppRoutes.Dashboard, {
      new: 'true',
    });
  }

  updateCustomer(customerId: number): void {
    this.navigateWithMergedParams(AppRoutes.Dashboard, {
      update: customerId,
    });
  }

  deleteCustomer(customerId: number): void {
    this.navigateWithMergedParams(AppRoutes.Dashboard, {
      delete: customerId,
    });
  }

  navigateWithMergedParams(url: string, queryParams: any) {
    this.router.navigate([url], {
      queryParams: { ...queryParams },
      queryParamsHandling: 'merge',
    });
  }
}
