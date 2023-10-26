import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../models/entities/color';
import { Car } from '../models/entities/car';

@Pipe({
  name: 'filterColorPipe'
})
export class FilterColorPipePipe implements PipeTransform {

  transform(cars: Car[], selectedColorIds: number[]): Car[] {
    if (!selectedColorIds.length) {
      return cars;
    }
    return cars.filter((car) => selectedColorIds.includes(car.colorId));
  }
}
