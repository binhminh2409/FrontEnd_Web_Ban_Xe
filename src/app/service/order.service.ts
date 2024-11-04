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

    return this.http.get<{ success: boolean; httpStatusCode: number; message: string; data: Order[] }>(
      `${this.apiUrl}/MyOrders`,
      { headers }
    ).pipe(
      switchMap(orderResponse => {
        if (!orderResponse.success || !Array.isArray(orderResponse.data)) {
          throw new Error('Expected a successful response with an array of orders');
        }

        const orders = orderResponse.data;

        const orderDetailsObservables = orders.map(order =>
          this.http.get<{ success: boolean; httpStatusCode: number; message: string; data: OrderDetail[] }>(`${this.apiUrl}/MyOrdersDetails`, { headers }).pipe(
            map(detailsResponse => {
              if (!detailsResponse.success || !Array.isArray(detailsResponse.data)) {
                throw new Error('Expected a successful response with an array of orders');
              }
              var details = detailsResponse.data;
              console.log(order)
              const orderDetail = details.find(detail => detail.orderID === order.no_);
              return {
                ...order,
                orderDetails: orderDetail || null
              } as OrderWithDetail;
            })
          )
        );
        return forkJoin(orderDetailsObservables);
      }),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]);
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
