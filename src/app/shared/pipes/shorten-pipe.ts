import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

 transform(value: string,  limit: number = 30): string {
    return value.slice(0, limit) + '...';
  }

}
