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
  private _ageFrom: number =
    new Date().getFullYear() - this.defaultDate.getFullYear();
  private _ageTo: number =
    new Date().getFullYear() - this.defaultDate.getFullYear();
  private _dobFrom: Date = this.defaultDate;
  private _dobTo: Date = this.defaultDate;

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}
  @Output() searchEmiter = new EventEmitter<string>();

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.searchText = params['search'] || '';
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
    const age = new Date().getFullYear() - this._dobFrom.getFullYear();
    this._ageFrom = age >= 0 ? age : 0;
  }

  get dobTo(): string {
    return this._dobTo.toISOString().split('T')[0];
  }

  set dobTo(value: string) {
    this._dobTo = new Date(value);
    const age = new Date().getFullYear() - this._dobTo.getFullYear();
    this._ageTo = age >= 0 ? age : 0;
  }
}
