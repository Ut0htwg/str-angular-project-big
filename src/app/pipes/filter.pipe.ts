import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], phrase: string, key: string = ''): any {

    if (key) {
      if (!Array.isArray(value) || !phrase) {
        return value;
      } else {
        phrase = phrase.toLowerCase();
        return value.filter(item => String(item[key]).toLowerCase().includes(phrase));
      }
    }
    else {
      if (!Array.isArray(value) || !phrase) {
        return value;
      }

      phrase = ('' + phrase).toLowerCase();
      return value.filter(
        item => JSON.stringify(item).toLowerCase().includes(phrase)
      );
    }
  }

}