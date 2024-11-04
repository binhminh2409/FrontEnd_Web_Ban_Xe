import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery } from '../models/Delivery'; // Create this model based on the expected response
import { PaymentDto } from '../models/PaymentDto';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'https://localhost:5001/api/Delivery';

  constructor(private http: HttpClient) { }

  getDeliveryDetails(orderId: number): Observable<Delivery> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Delivery>(`${this.apiUrl}/Order/${orderId}`, { headers });
  }

  createDelivery(paymentDto: PaymentDto, cityId: string, districtId: string): any {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(paymentDto);
    return this.http.post<Delivery>(`${this.apiUrl}/Create?cityFrom=100000&districtFrom=100900&districtTo=${districtId}&cityTo=${cityId}`, paymentDto, { headers });
  }
}
