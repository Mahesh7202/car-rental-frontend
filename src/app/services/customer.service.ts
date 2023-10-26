import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/responseModels/listResponseModel';
import { SingleResponseModel } from '../models/responseModels/singleResponseModel';
import { Customer } from '../models/entities/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiUrl = 'https://localhost:44372/api/customers/';

  constructor(private httpClient: HttpClient) { }

  // Get all customers
  getCustomers(): Observable<ListResponseModel<Customer>> {
    let newPath = this.apiUrl + 'getall';
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  // Get customer by ID
  getCustomerById(id: number): Observable<SingleResponseModel<Customer>> {
    let newPath = this.apiUrl + 'getbyid?id=' + id;
    return this.httpClient.get<SingleResponseModel<Customer>>(newPath);
  }

  // Get customer by User ID
  getCustomerByUserId(userId: number): Observable<SingleResponseModel<Customer>> {
    let newPath = this.apiUrl + 'getbyuserid?UserId=' + userId;
    return this.httpClient.get<SingleResponseModel<Customer>>(newPath);
  }

  // Get customer details
  getCustomerDetails(): Observable<ListResponseModel<Customer>> {
    let newPath = this.apiUrl + 'getdetails';
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  // Add a new customer
  addCustomer(customer: Customer): Observable<SingleResponseModel<number>> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<SingleResponseModel<number>>(newPath, customer);
  }

  // Update an existing customer
  updateCustomer(customer: Customer): Observable<SingleResponseModel<number>> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<SingleResponseModel<number>>(newPath, customer);
  }

  // Delete a customer by ID
  deleteCustomer(id: number): Observable<SingleResponseModel<number>> {
    let newPath = this.apiUrl + 'delete?id=' + id;
    return this.httpClient.post<SingleResponseModel<number>>(newPath, id);
  }
}
