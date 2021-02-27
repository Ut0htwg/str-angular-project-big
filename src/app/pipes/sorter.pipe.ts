import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorter'
})
export class SorterPipe implements PipeTransform {


  transform(value: any[] | null, direction: string, key: string): any[] | null {

    if (!Array.isArray(value) || !key || !direction) {
      return value;
    }

    let sortedItems = [];
    sortedItems = direction === 'asc' ? this.sortAscending(value, key) : this.sortDescending(value, key)

    return sortedItems;

  }

  sortAscending(value: any[], key: string): any[] {
    return value.sort((a, b) => {
      if (typeof (a[key]) === 'number' && typeof (b[key]) === 'number') {
        return a[key] - b[key];
      } else {
        a[key] = ('' + a[key]).toLowerCase();
        b[key] = ('' + b[key]).toLowerCase();
        return a[key].localeCompare(b[key]);
      }
    })
  }

  sortDescending(value: any[], key: string): any[] {
    return value.sort((a, b) => {
      if (typeof (a[key]) === 'number' && typeof (b[key]) === 'number') {
        return b[key] - a[key];
      } else {
        a[key] = ('' + a[key]).toLowerCase();
        b[key] = ('' + b[key]).toLowerCase();
        return b[key].localeCompare(a[key]);
      }
    })
  }


}