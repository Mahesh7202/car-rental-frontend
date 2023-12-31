import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../models/entities/rental';
import { RentPaymentRequest } from '../models/paymentModels/rent-payment-request';
import { ListResponseModel } from '../models/responseModels/listResponseModel';
import { SingleResponseModel } from '../models/responseModels/singleResponseModel';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  apiUrl = 'https://localhost:44372/api/';
  constructor(private httpClient: HttpClient,  private http: HttpClient) { }

  sendMail(bookingData: any) {
    const backendUrl = this.apiUrl + 'Customer/SendMail'; // Replace with your actual backend API URL

    return this.http.post(backendUrl, bookingData);
  }

  getRentals(): Observable<ListResponseModel<Rental>> {
    let newPath = this.apiUrl + 'rentals/getall';
    return this.httpClient.get<ListResponseModel<Rental>>(newPath);
  }


  getRentalsDetails(): Observable<ListResponseModel<Rental>> {
    let newPath = this.apiUrl + 'rentals/getdetails';
    return this.httpClient.get<ListResponseModel<Rental>>(newPath);
  }

  getRentalsByCustomerIdWithDetails(customerId: number): Observable<ListResponseModel<Rental>> {
    let newPath = this.apiUrl + 'rentals/getrentalsbycustomeridwithdetails?customerId=' + customerId;
    return this.httpClient.get<ListResponseModel<Rental>>(newPath);
  }



  CheckIfCanCarBeRentedNow(carId: number): Observable<SingleResponseModel<boolean>> {
    let newPath = this.apiUrl + 'rentals/checkifcancarberentednow?carid=' + carId;
    return this.httpClient.get<SingleResponseModel<boolean>>(newPath);
  }

  checkIfCanCarBeRentedBetweenSelectedDates(carId: number, rentDate: string, returnDate: string): Observable<SingleResponseModel<boolean>> {
    let newPath = this.apiUrl + 'rentals/checkifcancarberentedbetweenselecteddates?carid=' + carId + '&rentdate=' + rentDate + '&returndate=' + returnDate;
    return this.httpClient.get<SingleResponseModel<boolean>>(newPath);
  }

  rent(rentRequest:RentPaymentRequest):Observable<SingleResponseModel<number>>{
    let newPath = this.apiUrl + 'rentals/rent';
    return this.httpClient.post<SingleResponseModel<number>>(newPath,rentRequest);
  }

  deleteRental(id: number): Observable<any> {
    let newPath = `${this.apiUrl}rentals/delete`;

    const formData = new FormData();
    formData.append('id', id.toString());

    return this.httpClient.post(newPath, formData);
  }


}
