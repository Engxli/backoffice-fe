import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppRoutes } from '../../models/AppRoutes';
import { CustomerService } from '../../services/customer.service';
import { FormatDatePipe } from '../../utils/pipes/format-date.pipe';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  name: string = '';
  _age: number = 0;
  _dateOfBirth: Date = new Date();
  gender: string = '';
  genders = ['male', 'female']; // Added for gender options
  errorMessage: string = '';
  modalTitle: string = 'Add New Customer';
  submitButtonLabel: string = 'Create Customer';
  isUpdateMode: boolean = false;
  customerIdToUpdate: string | null = null;
  formatDatePipe = new FormatDatePipe();

  @Output() customerAdded = new EventEmitter<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['new'] === 'true') {
        this.prepareForNewCustomer();
      } else if (params['update']) {
        this.customerIdToUpdate = params['update'];
        this.prepareForUpdateCustomer(this.customerIdToUpdate!);
      }
    });
  }

  prepareForNewCustomer(): void {
    this.modalTitle = 'Add New Customer';
    this.submitButtonLabel = 'Create Customer';
    this.isUpdateMode = false;
  }

  prepareForUpdateCustomer(id: string): void {
    this.customerService.getCustomerById(Number(id)).subscribe((customer) => {
      this.name = customer.name;
      this.age = customer.age;
      this.dateOfBirth = this.formatDatePipe.transform(customer.dateOfBirth);
      this.gender = customer.gender;
      this.modalTitle = 'Update Customer';
      this.submitButtonLabel = 'Update Customer';
      this.isUpdateMode = true;
    });
  }

  closeModal(): void {
    this.router.navigate([AppRoutes.Dashboard], {
      queryParams: { new: 'false', update: null },
      queryParamsHandling: 'merge',
    });
  }

  createOrUpdateCustomer(): void {
    if (!this.name || !this.age || !this.dateOfBirth || !this.gender) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const customerData = {
      name: this.name,
      age: this._age,
      dateOfBirth: this.formatDatePipe.transform(this._dateOfBirth),
      gender: this.gender,
    };

    if (this.isUpdateMode && this.customerIdToUpdate) {
      this.customerService
        .updateCustomer(Number(this.customerIdToUpdate), customerData)
        .subscribe({
          next: () => {
            this.customerAdded.emit();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = error.error.message || error.error;
            console.error('There was an error updating the customer:', error);
          },
        });
    } else {
      this.customerService.addCustomer(customerData).subscribe({
        next: () => {
          this.customerAdded.emit();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = error.error.message || error.error;
          console.error('There was an error adding the customer:', error);
        },
      });
    }
  }

  get age(): string {
    return this._age > 0 ? this._age.toString() : '';
  }

  set age(value: string) {
    this._age = value ? parseInt(value, 10) : 0;
  }

  get dateOfBirth(): string {
    return this.formatDatePipe.transform(this._dateOfBirth);
  }

  set dateOfBirth(value: string) {
    this._dateOfBirth = new Date(value);
  }
}
