import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PaymentDto } from '../models/PaymentDto';
import { of, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:5001/api/Payment';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return userId ? +userId : null;
  }

  createPayment(paymentDto: PaymentDto): Observable<PaymentDto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post<any>(`${this.apiUrl}/Create`, paymentDto, { headers }).pipe(
      map((createResponse) => {
        const paymentDto = createResponse?.data;
        if (paymentDto) {
          console.log('Payment created with ID:', paymentDto.id);
          return paymentDto;
        } else {
          console.error('No payment ID returned from Create request.');
          throw new Error('Payment ID is missing');
        }
      }),
      catchError((err) => {
        console.error('Error creating payment:', err);
        return throwError(() => err);
      })
    );
  }

  confirmPayment(paymentId: number): Observable<PaymentDto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.put<any>(`${this.apiUrl}/Confirm?paymentId=${paymentId}`, null, { headers }).pipe(
      map((confirmResponse) => {
        if (confirmResponse?.success && confirmResponse?.data) {
          console.log('Confirmed Payment Data:', confirmResponse.data);
          return confirmResponse.data as PaymentDto; // Cast to PaymentDto for the correct return type
        } else {
          console.error('Unexpected response format from Confirm request');
          throw new Error('Invalid response format');
        }
      }),
      catchError((err) => {
        console.error('Error confirming payment:', err);
        return throwError(() => err);
      })
    );
  }
  


  processPayment(paymentDto: PaymentDto): Observable<PaymentDto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/Create`, paymentDto, { headers }).pipe(
      switchMap((createResponse) => {
        const paymentId = createResponse?.data?.id;
        if (paymentId) {
          return this.http.put<any>(`${this.apiUrl}/Confirm?paymentId=${paymentId}`, null, { headers });
        } else {
          console.error('No payment ID returned from Create request.');
          return throwError(() => new Error('Payment ID is missing'));
        }
      }),
      map((confirmResponse) => {
        if (confirmResponse?.success && confirmResponse?.data) {
          console.log('Confirmed Payment Data:', confirmResponse.data);
          return confirmResponse.data as PaymentDto;  // Cast to PaymentDto for the correct return type
        } else {
          console.error('Unexpected response format from Confirm request');
          throw new Error('Invalid response format');
        }
      }),
      catchError((err) => {
        console.error('Error during payment processing:', err);
        return throwError(() => err);
      })
    );
  }


}
