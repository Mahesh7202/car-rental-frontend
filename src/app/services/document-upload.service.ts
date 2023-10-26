import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { DocumentProof } from '../models/entities/DocumentProof';

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {
  private apiUrl = 'https://localhost:44372/api/documentproofs'; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<DocumentProof[]> {
    return this.httpClient.get<DocumentProof[]>(`${this.apiUrl}/getall`);
  }

  getById(id: number): Observable<DocumentProof> {
    return this.httpClient.get<DocumentProof>(`${this.apiUrl}/getbyid?id=${id}`);
  }

  add(documentProof: DocumentProof, file: File, userId: number): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('documentProof', JSON.stringify(documentProof));

    formData.append('file', file);
    formData.append('userId', userId.toString());

    const req = new HttpRequest('POST', `${this.apiUrl}/add`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.httpClient.request(req);
  }



  update(documentProof: DocumentProof, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Add other fields from the documentProof object as needed

    const req = new HttpRequest('POST', `${this.apiUrl}/update`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.httpClient.request(req);
  }

  delete(documentProof: DocumentProof): Observable<any> {
    // You can use a simple HTTP DELETE request
    // Assuming you need to pass the documentProof's 'id' for deletion
    return this.httpClient.delete(`${this.apiUrl}/delete?id=${documentProof.id}`);
  }

}
