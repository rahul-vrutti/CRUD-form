import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'device',
  standalone: true
})
export class DevicePipe implements PipeTransform {

  transform(pageEvent: any, index: number): any {
    return ((+pageEvent.pageSize) * (+pageEvent.pageIndex + 1) - (+pageEvent.pageSize) + 1) + index
  }

}
