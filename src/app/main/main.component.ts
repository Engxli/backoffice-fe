// src/app/main/main.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { CustomersComponent } from './customers/customers.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  customers: any[] = [];
  showModal: boolean = false;
  @ViewChild('customerComponent') customerComponent!: CustomersComponent;

  onCustomerAdded(): void {
    this.customerComponent.loadCustomers();
  }

  onSearch(search: string) {
    this.customerComponent.loadCustomersWithSearch(search);
  }
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.showModal =
        params.get('new') === 'true' ||
        !!params.get('update') ||
        !!params.get('delete');
    });
  }
}
