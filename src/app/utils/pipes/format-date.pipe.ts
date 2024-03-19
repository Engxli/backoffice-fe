import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    let date: Date;

    // Check if the value is already a Date object. If not, create a Date object from the string.
    if (value instanceof Date) {
      date = value;
    } else {
      // Assuming the string is in ISO format or compatible with Date constructor
      date = new Date(value);
    }

    // Ensure the date is valid
    if (!isNaN(date.getTime())) {
      // Format the date as yyyy-mm-dd
      const year = date.getFullYear();
      const month = this.pad(date.getMonth() + 1); // Month is 0-indexed
      const day = this.pad(date.getDate());

      return `${year}-${month}-${day}`;
    } else {
      return 'Invalid Date';
    }
  }

  // Helper function to pad single digits with leading zero
  private pad(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}
