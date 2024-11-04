import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private baseUrl = 'https://localhost:5001/api'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getQrCode(bank: string, accountNumber: string, amount: string, ndck: string, fullName: string): string {
    return `https://api.vieqr.com/vietqr/Techcombank/8896898888/${amount}/full.jpg?NDck=${ndck}&FullName=Vuong%20Quoc%20Binh%20Minh`;
  }
}
