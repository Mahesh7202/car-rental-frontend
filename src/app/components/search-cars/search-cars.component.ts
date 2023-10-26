import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/models/entities/brand';
import { Car } from 'src/app/models/entities/car';
import { Color } from 'src/app/models/entities/color';
import { FilterBrandPipePipe } from 'src/app/pipes/filter-brand-pipe.pipe';
import { FilterColorPipePipe } from 'src/app/pipes/filter-color-pipe.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { CarImagesService } from 'src/app/services/car-images.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.css'],
})
export class SearchCarsComponent implements OnInit {
  cars: Car[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];

  filterBrandIds: number[] = [];
  filterColorIds: number[] = [];
  filteredCars: Car[] = [];

  filterBrandId: number = 1;
  filterColorId: number = 1;
  filterCarModelName: string = '';

  carsDataLoaded: boolean = false;
  brandsDataLoaded: boolean = false;
  colorsDataLoaded: boolean = false;

  maxRandomCarLength: number = 5;
  randomCars: Car[] = [];

  routerLink: string = '';
  searchTerm: string = '';
  searchQuery: string = '';

  brandFilterPipe: FilterBrandPipePipe;
  colorFilterPipe: FilterColorPipePipe;




  constructor(
    private carService: CarService,
    private carImagesService: CarImagesService,
    private activatedRoute: ActivatedRoute,
    private brandService: BrandService,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.initializeData().then(() => {

      this.activatedRoute.params.subscribe((params) => {
        console.log(params);

        if (params['query']) {
          this.searchQuery = params['query']
          console.log(this.searchQuery);
          this.filterCarsByModalName(this.searchQuery);
        }
        console.log(this.brands);
        console.log(this.cars);
      });
    });
  }

  async initializeData() {
    try {
      await this.getBrands();
      await this.getColors();
      await this.getCars();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  async getCars() {
    try {
      const response = await this.carService.getCars().toPromise();
      this.cars = response.data;
      this.filteredCars = this.cars;
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true;
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }

  async getBrands() {
    try {
      const response = await this.brandService.getBrands().toPromise();
      this.brands = response.data;
      this.brandsDataLoaded = true;
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }

  async getColors() {
    try {
      const response = await this.colorService.getColors().toPromise();
      this.colors = response.data;
      this.colorsDataLoaded = true;
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  }


  getCarsByBrand(brandId: number) {
    this.carService.getCarsByBrandId(brandId).subscribe((response) => {
      this.cars = response.data;
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true;
    });
  }

  getCarsByColor(colorId: number) {
    this.carService.getCarsByColorId(colorId).subscribe((response) => {
      this.cars = response.data;
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true;
    });
  }

  getRandomCars(carList: Car[], number: number) {
    let tempCarList: Car[] = [];
    carList.forEach((car) => {
      tempCarList.push(car);
    });

    this.randomCars = [];
    if (number > tempCarList.length) {
      number = tempCarList.length;
    }
    for (let i = 0; i < number; i++) {
      let randomNumber = this.getRandomNumber(tempCarList.length);
      let randomCar = tempCarList[randomNumber];
      if (randomCar.carImages[0].imagePath != '/images/default.jpg') {
        this.randomCars.push(randomCar);
      }
      tempCarList.splice(randomNumber, 1);
    }
  }

  private getRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }

  getCarsByFilter(brandId: number, colorId: number) {
    this.carService.getCarsByFilter(brandId, colorId).subscribe((response) => {
      this.cars = response.data;
      this.carsDataLoaded = true;
    });
  }

  getImagePath(imagePath: string) {
    return this.carImagesService.getImagePath(imagePath);
  }



  isChecked(brandId: number): boolean {
    return this.filterBrandIds.includes(brandId);
  }

  toggleBrandSelection(brandId: number): void {
    if (this.isChecked(brandId)) {
      // Brand is already selected, so remove it from the array
      this.filterBrandIds = this.filterBrandIds.filter((id) => id !== brandId);
    } else {
      // Brand is not selected, so add it to the array
      this.filterBrandIds.push(brandId);
    }
  }

  isCheckedColor(colorId: number): boolean {
    return this.filterColorIds.includes(colorId);
  }

  toggleColorSelection(colorId: number): void {
    if (this.isCheckedColor(colorId)) {
      // Color is already selected, so remove it from the array
      this.filterColorIds = this.filterColorIds.filter(
        (id) => id !== colorId
      );
    } else {
      // Color is not selected, so add it to the array
      this.filterColorIds.push(colorId);
    }
  }


  filterCars(): Car[] {
    console.log("hasLifecycleHook")
    console.log(this.filterBrandIds)
    console.log(this.filterColorIds)

    this.filteredCars =   this.cars.filter(car => {
      const brandSelected = this.filterBrandIds.length === 0 || this.filterBrandIds.includes(car.brandId);
      const colorSelected = this.filterColorIds.length === 0 || this.filterColorIds.includes(car.colorId);
      return brandSelected && colorSelected;
    });

    console.log(this.filteredCars)

    return this.filteredCars;
  }

  filterCarsByModalName(brandName: string): void {
    const selectedBrand = this.brands.find(brand => brand.name.toLowerCase() === brandName.toLowerCase());
    console.log(brandName)
    if (selectedBrand) {
      this.filteredCars = this.cars.filter(car => car.brandId === selectedBrand.id);
    } else {
      this.filteredCars = this.cars;
    }
  }


  clearSearch(){}


}
