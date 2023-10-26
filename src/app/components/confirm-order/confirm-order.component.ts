import { ConfirmOrderOutputModel } from '../../models/paymentModels/confirm-order-output-model';
import { ToastrService } from 'ngx-toastr';
import { CreditCardService } from './../../services/credit-card.service';
import { RentalService } from './../../services/rental.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarImagesService } from './../../services/car-images.service';
import { DateTimeService } from './../../services/date-time.service';
import { CartItem } from './../../models/entities/carItem';
import { ConfirmOrderInputModel } from './../../models/paymentModels/confirm-order-input-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditCard } from 'src/app/models/entities/credit-card';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})

export class ConfirmOrderComponent implements OnInit {

  @Input() confirmOrderInputModel: ConfirmOrderInputModel;

  @Output() confirmOrderOutputModel: EventEmitter<ConfirmOrderOutputModel> = new EventEmitter<ConfirmOrderOutputModel>();
  @Output() bookingData:EventEmitter<any>= new EventEmitter<any>();

  constructor(
    private dateTimeService: DateTimeService,
    private carImagesService: CarImagesService,
    private spinner: NgxSpinnerService,
    private rentalService: RentalService,
    private creditCardService: CreditCardService,
    private toastrService: ToastrService,
    private cartService: CartService,
    private authService: AuthService,
    private customerService: CustomerService

  ) { }

  ngOnInit(): void {

  }


  // Function to calculate the subtotal (before tax)
  calculateSubtotal(cartItems: CartItem[]): number {
    let subtotal: number = 0;
    cartItems.forEach(cartItem => {
      let rentalPeriod = this.getRentalPeriod(cartItem.rentDate, cartItem.returnDate);
      subtotal += cartItem.car.dailyPrice * rentalPeriod;
    });
    return subtotal;
  }

  // Function to calculate the sales tax (10%)
  calculateSalesTax(cartItems: CartItem[]): number {
    const subtotal = this.calculateSubtotal(cartItems);
    return subtotal * 0.1;
  }

  // Function to calculate the service tax (5%)
  calculateServiceTax(cartItems: CartItem[]): number {
    const subtotal = this.calculateSubtotal(cartItems);
    return subtotal * 0.05;
  }

  calculateVAT(cartItems: CartItem[]): number {
    const subtotal = this.calculateSubtotal(cartItems);
    return subtotal * 0.07;
  }

  // Function to calculate the insurance fee ($20 per order)
  calculateInsuranceFee(): number {
    return 20;
  }

  rent() {
    this.spinner.show();
    this.rentalService.rent(this.confirmOrderInputModel.rentPaymentRequest).subscribe(response => {
      if (this.confirmOrderInputModel.isCreditCardSaving === true) {
        this.saveCreditCard().then((result) => {
          result === true
            ? this.toastrService.success("Successfully Registered Credit Card", "Credit Card Registered")
            : this.toastrService.warning("Failed to Register Credit Card", "Credit Card Not Registered");
        });
      }
      this.toastrService.success(response.message, "Payment Successfull")

      let confirmOrderOutputModel = {
        numberOfTotalRentedCar: this.confirmOrderInputModel.cartItems.length,
        totalRentalDays: this.calculateTotalRentalPeriod(this.confirmOrderInputModel.cartItems),
        totalAmount: this.calculateTotalAmount(this.confirmOrderInputModel.cartItems),
        rentalDate: this.dateTimeService.getFullDateTimeNow(),
        paymentId: response.data
      };

      let bookingData = {
        user: this.getUser(),
        cardetails: this.getCardetails(),
        orderData: confirmOrderOutputModel
      };
      console.log(this.bookingData);

      this.bookingData.emit(bookingData)
      this.confirmOrderOutputModel.emit(confirmOrderOutputModel);

      this.spinner.hide();
    },
      error => {
        this.toastrService.error(error.error.message, "Payment Failed")
        this.spinner.hide();
      });
  }


  getUser(){
    const user:any = this.authService.getUser();
    return user;
  }

  getCardetails(){
      let cardetails: any[] = [];
      for (let i = 0; i < this.confirmOrderInputModel.cartItems.length; i++) {
        cardetails.push(this.confirmOrderInputModel.cartItems[i]);
      }
      return cardetails;
  }



  saveCreditCard(): Promise<boolean> {
    return new Promise<boolean>((methodResolve) => {
      let creditCard = new CreditCard;
      let rentPaymentRequest = this.confirmOrderInputModel.rentPaymentRequest;
      creditCard.cardNumber = rentPaymentRequest.cardNumber;
      creditCard.expireYear = rentPaymentRequest.expireYear;
      creditCard.expireMonth = rentPaymentRequest.expireMonth;
      creditCard.cvc = rentPaymentRequest.cvc;
      creditCard.cardHolderFullName = rentPaymentRequest.cardHolderFullName;

      let customerCreditCardModel = {
        creditCard: creditCard,
        customerId: rentPaymentRequest.customerId
      }
      this.creditCardService.saveCreditCard(customerCreditCardModel).subscribe(() => {
        methodResolve(true);
      }, () => {
        methodResolve(false);
      })
    })
  }

  getCreditCardLogoSource(cardNumber: string) {
    return this.creditCardService.getCreditCardLogoSource(cardNumber);
  }

  calculateTotalAmount(cartItems: CartItem[]): number {
    const subtotal = this.calculateSubtotal(cartItems);
    const salesTax = this.calculateSalesTax(cartItems);
    const serviceTax = this.calculateServiceTax(cartItems);
    const vat = this.calculateVAT(cartItems);
    const insuranceFee = this.calculateInsuranceFee();

    return subtotal + salesTax + serviceTax + vat + insuranceFee;
  }

  calculateTotalRentalPeriod(cartItems: CartItem[]): number {
    return this.cartService.calculateTotalRentalPeriod(cartItems);
  }

  getRentalPeriod(rentDate: Date, returnDate: Date): number {
    return this.dateTimeService.getRentalPeriod(rentDate, returnDate);
  }

  getImagePath(imagePath: string) {
    return this.carImagesService.getImagePath(imagePath);
  }

  showDate(date: Date) {
    return this.dateTimeService.showDate(date);
  }
}
