// src/app/main/main.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  customers: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  addCustomer() {
    // Navigate to the add customer component/page
    this.router.navigate(['/add-customer']);
  }

  updateCustomer(customerId: number) {
    // Navigate to the update customer component/page with customerId
    this.router.navigate(['/update-customer', customerId]);
  }
}
