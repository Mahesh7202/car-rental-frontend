import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/entities/car';
import { CarImage } from 'src/app/models/entities/car-image';
import { Rental } from 'src/app/models/entities/rental';
import { AuthService } from 'src/app/services/auth.service';
import { CarImagesService } from 'src/app/services/car-images.service';
import { CarService } from 'src/app/services/car.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DateTimeService } from 'src/app/services/date-time.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css'],
})
export class RentalComponent implements OnInit {
  rentals: Rental[] = [];
  currentUser: any;
  dataLoaded: boolean = false;
  bookingDetails: any;

  cardetails: Car;
  carImages: CarImage;
  rentItems: any[] = [];

  rental: any;

  showDetails:boolean = false;
  customerId: any;

  constructor(
    private rentalService: RentalService,
    private customerService: CustomerService,
    private authService: AuthService,
    private carService: CarService,
    private carImagesService: CarImagesService,
    private dateTimeService: DateTimeService,
    private toastrService: ToastrService

  ) {}

  ngOnInit(): void {
    this.getCustomerId().then(() => {
      this.getRentals().then(() => {
        this.setRentalData();
      });
    });
  }

  async getCustomerId() {
    this.currentUser = this.authService.getUser();
    console.log(this.currentUser);
    const response = await this.customerService
      .getCustomerByUserId(this.currentUser.id)
      .toPromise();
    this.customerId = response.data.id;
  }

  async getRentals() {
    const response = await this.rentalService
      .getRentalsByCustomerIdWithDetails(this.customerId)
      .toPromise();
    this.rentals = response.data;
    console.log("detailed rents based on the customerId"+this.customerId)
    console.log(response.data);
    this.dataLoaded = true;
  }

  async setRentalData() {
    for (const rental of this.rentals) {
      const cardetails = await this.getCardetails(rental.carId);
      const carimage = await this.getCarImages(rental.carId);

      const rent = {
        rental: rental,
        cardetails: cardetails,
        carimage: carimage,
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



  showRentalDetails(rental: any) {
    console.log('hejhejkrhkjehrjehjrhwjekrhjwkehrjkwehrkjwehrj');
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
    const formattedDate = this.dateTimeService.formatDateOfRent(
      date.toISOString()
    );
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
