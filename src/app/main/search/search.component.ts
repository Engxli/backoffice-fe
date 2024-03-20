import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '../../models/AppRoutes';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private searchTerms = new Subject<string>();
  searchText: string = '';
  isAdvancedSearch: boolean = false;
  private defaultDate: Date = new Date('1998-09-06');
  private _ageFrom: number = this.calculateAge(this.defaultDate);
  private _ageTo: number = this.calculateAge(this.defaultDate);
  private _dobFrom: Date = this.defaultDate;
  private _dobTo: Date = this.defaultDate;
  applyFilters: boolean = false;
  constructor(private router: Router, private activeRoute: ActivatedRoute) {}
  @Output() searchEmiter = new EventEmitter<string>();
  @Output() filterEmiter = new EventEmitter<any>();

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.searchText = params['search'] || '';
      this.isAdvancedSearch = params['filter'] === 'true';
      this.applyFilters = params['applyFilters'] === 'true';
      if (
        params['dobFrom'] &&
        params['dobTo'] &&
        params['ageFrom'] &&
        params['ageTo']
      ) {
        this.dobFrom = params['dobFrom'];
        this.dobTo = params['dobTo'];
        this.applyFilters = true;
      }
    });
    this.searchTerms
      .pipe(
        debounceTime(400) // Wait for 300ms of pause in events
      )
      .subscribe((searchText) => {
        console.log(searchText);
        this.router.navigate([AppRoutes.Dashboard], {
          queryParams: {
            search: searchText == '' ? null : searchText.trim(),
            page: 1,
          },
          queryParamsHandling: 'merge',
        });
        this.searchEmiter.emit(searchText.trim());
      });
  }

  searchCustomers(): void {
    this.searchTerms.next(this.searchText);
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearch = !this.isAdvancedSearch;

    this.router.navigate([AppRoutes.Dashboard], {
      queryParams: {
        filter: this.isAdvancedSearch,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterCustomers(): void {
    this.filterEmiter.emit({
      ageFrom: this.ageFrom,
      ageTo: this.ageTo,
      dobFrom: this.dobFrom,
      dobTo: this.dobTo,
    });
    this.router
      .navigate([AppRoutes.Dashboard], {
        queryParams: {
          ageFrom: this.ageFrom > 0 ? this.ageFrom : null,
          ageTo: this.ageTo > 0 ? this.ageTo : null,
          dobFrom: this.dobFrom,
          dobTo: this.dobTo,
          page: 1,
        },
        queryParamsHandling: 'merge',
      })
      .then(() => {
        this.toggleAdvancedSearch();
      });
  }

  clearFilters(): void {
    this.filterEmiter.emit({
      ageFrom: '',
      ageTo: '',
      dobFrom: '',
      dobTo: '',
    });
    this.router
      .navigate([AppRoutes.Dashboard], {
        queryParams: {
          ageFrom: null,
          ageTo: null,
          dobFrom: null,
          dobTo: null,
          applyFilters: false,
        },
        queryParamsHandling: 'merge',
      })
      .then(() => {
        this.applyFilters = false;
      });
  }

  get ageFrom(): number {
    return this._ageFrom;
  }

  set ageFrom(value: number) {
    this._ageFrom = value;
    if (value > 0) {
      const currentDate = new Date();
      this._dobFrom = new Date(
        currentDate.getFullYear() - value,
        currentDate.getMonth(),
        currentDate.getDate()
      );
    }
  }

  get ageTo(): number {
    return this._ageTo;
  }

  set ageTo(value: number) {
    this._ageTo = value;
    if (value > 0) {
      const currentDate = new Date();
      this._dobTo = new Date(
        currentDate.getFullYear() - value,
        currentDate.getMonth(),
        currentDate.getDate()
      );
    }
  }

  get dobFrom(): string {
    return this._dobFrom.toISOString().split('T')[0];
  }

  set dobFrom(value: string) {
    this._dobFrom = new Date(value);
    const currentDate = new Date();
    let age = this.calculateAge(this._dobFrom);
    this._ageFrom = age >= 0 ? age : 0;
  }

  get dobTo(): string {
    return this._dobTo.toISOString().split('T')[0];
  }

  set dobTo(value: string) {
    this._dobTo = new Date(value);
    const currentDate = new Date();
    let age = this.calculateAge(this._dobTo);
    this._ageTo = age >= 0 ? age : 0;
  }

  calculateAge(dob: Date): number {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDifference = currentDate.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < dob.getDate())
    ) {
      age--;
    }
    return age;
  }
}
