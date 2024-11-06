import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Order } from '../models/Order';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OrderWithDetail } from '../models/OrderWithDetails';
import { map, forkJoin } from 'rxjs';
import { OrderDetail } from '../models/Order_Details';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:5001/api/Order';

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

  cancelOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<{ success: boolean; httpStatusCode: number; message: string; data: string }>(
      `${this.apiUrl}/Cancel/${orderId}`,
      {},
      { headers }
    )
  }

  getOrdersWithDetailsByUserId(userId: number): Observable<OrderWithDetail[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<{ success: boolean; httpStatusCode: number; message: string; data: OrderWithDetail[] }>(
        `${this.apiUrl}/MyOrders`,
        { headers }
      )
      .pipe(
        map(orderResponse => {
          if (!orderResponse.success || !Array.isArray(orderResponse.data)) {
            throw new Error('Expected a successful response with an array of orders');
          }

          const ordersWithDetails: OrderWithDetail[] = orderResponse.data.map(order => ({
            ...order,
            OrderDetails: order.orderDetails as OrderDetail[]
          }));
          console.log(ordersWithDetails);
          return ordersWithDetails;
        }),
        catchError(error => {
          console.error('Error fetching orders:', error);
          return of([] as OrderWithDetail[]);
        })
      );
  }

  getOrdersWithDetailsByGuid(guid: string): Observable<OrderWithDetail[]> {
    return this.http
      .get<{ success: boolean; httpStatusCode: number; message: string; data: OrderWithDetail[] }>(
        `${this.apiUrl}/MyOrders?guid=${guid}`
      )
      .pipe(
        map(orderResponse => {
          if (!orderResponse.success || !Array.isArray(orderResponse.data)) {
            throw new Error('Expected a successful response with an array of orders');
          }

          const ordersWithDetails: OrderWithDetail[] = orderResponse.data.map(order => ({
            ...order,
            OrderDetails: order.orderDetails as OrderDetail[]
          }));
          console.log(ordersWithDetails);

          return ordersWithDetails;
        }),
        catchError(error => {
          console.error('Error fetching orders:', error);
          return of([] as OrderWithDetail[]);
        })
      );
  }


  getOrderById(orderId: number): Observable<OrderWithDetail> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{ success: boolean; httpStatusCode: number; message: string; data: OrderWithDetail }>(
      `${this.apiUrl}/MyOrders/${orderId}`,
      { headers }
    ).pipe(
      map(response => response.data)
    );
  }
}
