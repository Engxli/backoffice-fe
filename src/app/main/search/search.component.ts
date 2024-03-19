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
}
