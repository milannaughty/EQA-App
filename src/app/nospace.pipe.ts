import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nospace'
})
export class NospacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? value.replace(/ /g, '') : null;
  }

}
