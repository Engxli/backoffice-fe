import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppRoutes } from '../../models/AppRoutes';
import { CustomerService } from '../../services/customer.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  name: string = '';
  number: string = '';
  _age: number = 0;
  _dateOfBirth: Date = new Date();
  gender: string = '';
  genders = ['male', 'female'];
  errorMessage: string = '';
  modalTitle: string = '';
  submitButtonLabel: string = '';
  isUpdateMode: boolean = false;
  isDeleteMode: boolean = false;
  customerIdToUpdate: string | null = null;
  today: Date = new Date();

  @Output() customerAdded = new EventEmitter<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.isDeleteMode = params['delete'] ? true : false;
      this.isUpdateMode = params['update'] ? true : false;
      this.modalTitle = this.isUpdateMode
        ? 'Update Customer'
        : this.isDeleteMode
        ? 'Delete Customer'
        : 'Add New Customer';
      this.submitButtonLabel = this.isUpdateMode
        ? 'Update Customer'
        : this.isDeleteMode
        ? 'Delete Customer'
        : 'Create Customer';
      if (this.isUpdateMode || this.isDeleteMode) {
        const id = this.isUpdateMode ? 'update' : 'delete';
        this.customerIdToUpdate = params[id];
        this.prepareForUpdateCustomerOrDelete(params[id]);
      }
    });
  }

  prepareForUpdateCustomerOrDelete(id: string): void {
    this.customerService.getCustomerById(Number(id)).subscribe({
      next: (customer) => this.populateForm(customer),
      error: (error) => this.handleError(error),
    });
  }

  populateForm(customer: any): void {
    this.name = customer.name;
    this._age = customer.age;
    this.number = customer.number;
    this._dateOfBirth = new Date(customer.dateOfBirth);
    this.dateOfBirth = formatDate(this._dateOfBirth, 'yyyy-MM-dd', 'en-US');
    this.gender = customer.gender;
  }

  handleError(error: any): void {
    this.errorMessage =
      error.error.message || error.error || 'An error occurred';
    console.error('Error:', error);
  }

  createOrUpdateCustomer(): void {
    if (!this.validateForm()) return;
    if (this.isDeleteMode) {
      this.deleteCustomer();
      return;
    }
    const customerData = {
      name: this.name,
      age: this._age,
      number: this.number,
      dateOfBirth: formatDate(this._dateOfBirth, 'yyyy-MM-dd', 'en-US'),
      gender: this.gender,
    };

    const operation = this.isUpdateMode
      ? this.customerService.updateCustomer(
          Number(this.customerIdToUpdate),
          customerData
        )
      : this.customerService.addCustomer(customerData);

    operation.subscribe({
      next: () => this.finalizeOperation(),
      error: (error) => this.handleError(error),
    });
  }

  deleteCustomer(): void {
    if (!this.customerIdToUpdate) {
      this.errorMessage = 'Customer ID is required';
      return;
    }
    this.customerService
      .deleteCustomer(Number(this.customerIdToUpdate))
      .subscribe({
        next: () => this.finalizeOperation(),
        error: (error) => this.handleError(error),
      });
  }

  validateForm(): boolean {
    if (!this._age) {
      this.errorMessage = 'Age is required and cannot be 0';
      return false;
    }
    if (
      !this.name ||
      !this._age ||
      !this._dateOfBirth ||
      !this.gender ||
      !this.number
    ) {
      this.errorMessage = 'All fields are required';
      return false;
    }
    return true;
  }

  finalizeOperation(): void {
    this.customerAdded.emit();
    this.closeModal();
  }

  get age(): string {
    return this._age > 0 ? this._age.toString() : '';
  }

  set age(value: string) {
    const ageInt = parseInt(value, 10) || 0;
    this.syncAgeAndDOB(ageInt);
  }

  set dateOfBirth(value: string) {
    this._dateOfBirth = new Date(value);
    this.onDOBChange(value);
  }

  get dateOfBirth(): string {
    return formatDate(this._dateOfBirth, 'yyyy-MM-dd', 'en-US');
  }

  syncAgeAndDOB(age: number): void {
    this._age = age;
    if (age > 0) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - age;
      this._dateOfBirth.setFullYear(birthYear);
    }
  }

  onDOBChange(dob: string): void {
    this._dateOfBirth = new Date(dob);
    const age = new Date().getFullYear() - this._dateOfBirth.getFullYear();
    this._age = age >= 0 ? age : 0;
  }

  closeModal(): void {
    this.router.navigate([AppRoutes.Dashboard], {
      queryParams: { new: 'false', update: null, delete: null },
      queryParamsHandling: 'merge',
    });
  }
}
