import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/responseModels/listResponseModel';
import { ResponseModel } from '../models/responseModels/responseModel';
import { SingleResponseModel } from '../models/responseModels/singleResponseModel';
import { Review } from '../models/entities/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'https://localhost:44372/api/reviews';
  constructor(private httpClient: HttpClient) { }

  getAllReviews(): Observable<ListResponseModel<Review>> {
    return this.httpClient.get<ListResponseModel<Review>>(`${this.apiUrl}/getall`);
  }

  getReviewById(reviewId: number): Observable<SingleResponseModel<Review>> {
    return this.httpClient.get<SingleResponseModel<Review>>(`${this.apiUrl}/getbyid?id=${reviewId}`);
  }

  getReviewsByCarId(carId: number): Observable<ListResponseModel<Review>> {
    return this.httpClient.get<ListResponseModel<Review>>(`${this.apiUrl}/getbycarid?carId=${carId}`);
  }

  getReviewsByCustomerId(customerId: number): Observable<ListResponseModel<Review>> {
    return this.httpClient.get<ListResponseModel<Review>>(`${this.apiUrl}/getbycustomerid?customerId=${customerId}`);
  }

  addReview(review: Review): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(`${this.apiUrl}/add`, review);
  }

  updateReview(review: Review): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(`${this.apiUrl}/update`, review);
  }

  deleteReview(reviewId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(`${this.apiUrl}/delete?id=${reviewId}`, null);
  }
}
