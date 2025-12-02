import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string, searchKeys: string[]): any[] {
  if (!items || !searchText) return items;
    const lowerSearch = searchText.toLowerCase();

    return items.filter(item =>searchKeys.some(key => 
      String(item[key]).toLowerCase().includes(lowerSearch)));
   
  }

}
