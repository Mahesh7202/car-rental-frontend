import { ConfirmOrderOutputModel } from './../../models/paymentModels/confirm-order-output-model';
import { Component, Input, OnInit } from '@angular/core';
import { RentalService } from './../../services/rental.service';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.css']
})
export class PaymentSuccessfulComponent implements OnInit {


  @Input() confirmOrderOutputModel: ConfirmOrderOutputModel;
  @Input() bookingData: any;

  constructor(
    private rentalService: RentalService,
  ) { }

  ngOnInit(): void {
    console.log(this.bookingData)


    this.rentalService.sendMail(this.bookingData).subscribe(
      (response) => {
        // Handle the response here
        console.log('Email sent successfully:', response);
      },
      (error) => {
        // Handle errors here
        console.error('Error sending email:', error);
      }
    );
  }

}
