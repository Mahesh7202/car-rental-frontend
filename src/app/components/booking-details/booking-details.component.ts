import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Car } from 'src/app/models/entities/car';
import { CarImagesService } from 'src/app/services/car-images.service';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';
import { Rental } from 'src/app/models/entities/rental';
import { DateTimeService } from 'src/app/services/date-time.service';
import { CarImage } from 'src/app/models/entities/car-image';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {

  @Input() bookingDetails: any;

  ngOnInit(): void {
    console.log(this.bookingDetails)
  }

  cardetails: Car;
  carImages: CarImage;
  rentItems: any[] = [];

  rentals: Rental[] = [];



  dataLoaded:boolean=false;
  showDetails:boolean = false;


  constructor(
    private dateTimeService: DateTimeService,
    private brandService: BrandService,
    private rentalService: RentalService,
    private carService: CarService,
    private carImagesService: CarImagesService,
  ) { }



  async getRentals() {
    const response = await this.rentalService.getRentalsDetails().toPromise();
    this.rentals = response.data;
    console.log(response.data);
    this.dataLoaded = true;
  }

  async setRentalData() {
    for (const rental of this.rentals) {
      const cardetails = await this.getCardetails(rental.carId);
      const carimage = await this.getCarImages(rental.carId);
      cardetails.brandName = await this.getModalName(cardetails.brandId);

      const rent = {
        rental: rental,
        cardetails: cardetails,
        carimage: carimage
      };

      this.rentItems.push(rent);
    }
  }

  async getCardetails(id: number): Promise<any> {
    const response = await this.carService.getCarById(id).toPromise();
    this.cardetails = response.data;
    console.log(response.data);
    this.dataLoaded = true;
    return this.cardetails;
  }

  async getCarImages(id: number): Promise<any> {
    const response = await this.carImagesService.getCarsByCarId(id).toPromise();
    this.carImages = response.data;
    console.log(response.data);
    this.dataLoaded = true;
    return this.carImages;
  }

  async getModalName(id: number): Promise<any> {
    const response = await this.brandService.getBrandById(id).toPromise();
    return response.data.name;
  }





  showRentalDetails(rental: any){
    this.bookingDetails=rental;
  }



  getRentalPeriod(rentDate: Date, returnDate: Date): number {
      if (typeof rentDate === 'string') {
        rentDate = new Date(rentDate);
      }
      if (typeof returnDate === 'string') {
        returnDate = new Date(returnDate);
      }
    return this.dateTimeService.getRentalPeriod(rentDate, returnDate);
  }

  getImagePath(imagePath: string) {
    return this.carImagesService.getImagePath(imagePath);
  }

  showDate(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const formattedDate = this.dateTimeService.formatDateOfRent(date.toISOString());
    return formattedDate;
  }
}

