import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private baseUrl = 'https://localhost:5001/api'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getQrCode(bank: string, accountNumber: string, amount: string, ndck: string, fullName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/Payment/generate-qr`, {
      params: {
        bank: bank,
        accountNumber: accountNumber,
        amount: amount,
        ndck: ndck,
        fullName: fullName,
      },
      responseType: 'blob', // Set responseType to 'blob' for image
    });
  }
}
