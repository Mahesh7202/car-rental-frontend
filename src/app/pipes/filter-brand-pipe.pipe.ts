import { Pipe, PipeTransform } from '@angular/core';
import { Brand } from '../models/entities/brand';
import { Car } from '../models/entities/car';

@Pipe({
  name: 'filterBrandPipe'
})
export class FilterBrandPipePipe implements PipeTransform {

  // transform(value: Brand[], filterText:string): Brand[] {
  //   filterText = filterText?filterText.toLocaleLowerCase():"";
  //   return filterText?value.filter((b:Brand)=>b.name.toLocaleLowerCase().indexOf(filterText)!==-1):value;
  // }

    transform(cars: Car[], selectedBrandIds: number[]): Car[] {
      if (!selectedBrandIds.length) {
        return cars;
      }
      return cars.filter((car) => selectedBrandIds.includes(car.brandId));
    }
}
