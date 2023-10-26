import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Car } from 'src/app/models/entities/car';
import { CarImagesService } from 'src/app/services/car-images.service';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';
import { Rental } from 'src/app/models/entities/rental';
import { DateTimeService } from 'src/app/services/date-time.service';
import { CarImage } from 'src/app/models/entities/car-image';
import { BrandService } from 'src/app/services/brand.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-admin-booked-list',
  templateUrl: './admin-booked-list.component.html',
  styleUrls: ['./admin-booked-list.component.css']
})
export class AdminBookedListComponent implements OnInit {

  bookingDetails: any;

  cardetails: Car;
  carImages: CarImage;
  rentItems: any[] = [];

  rentals: Rental[] = [];

  rental: any;


  dataLoaded:boolean=false;
  showDetails:boolean = false;


  constructor(private location: Location,
    private router: Router,
    private dateTimeService: DateTimeService,
    private brandService: BrandService,
    private rentalService: RentalService,
    private carService: CarService,
    private carImagesService: CarImagesService,
    private toastrService: ToastrService

  ) { }

  ngOnInit(): void {
    this.getRentals().then(() => {
      this.setRentalData();
    });
  }

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



  showRentalDetails(rental: any) {
    console.log("hejhejkrhkjehrjehjrhwjekrhjwkehrjkwehrkjwehrj");
    console.log(rental);
    this.rental = true;
    this.bookingDetails = rental;
    this.bookingDetails.emit(this.rental);
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

  goBack(): void {
    this.rental=false;
  }

  deleteBooking(rental: Rental){
    console.log(rental.id)
    this.rentalService.deleteRental(rental.id).subscribe((res)=>{
      this.toastrService.success(rental.customerFullName + "your booking " + rental.modelFullName + " car Cancalled", "Cancalled Succesfull");
      this.toastrService.success(rental.customerFullName + "your PaymentId: "+rental.paymentId +" Will be refunds with in 24 hours ", "Refundable Succesfull");
      this.rentItems = this.rentItems.filter((item) => item.rental.id !== rental.id);
    }, errorResponse => {
      this.toastrService.error(errorResponse.error.message, "Deletion Failed");
    })
  }


}
