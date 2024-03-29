import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sort-icon',
  templateUrl: './sort-icon.component.html',
})
export class SortIconComponent {
  @Input() sortBy!: Boolean;
  @Input() sortOrder!: String;
}
