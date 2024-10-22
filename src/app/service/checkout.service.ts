import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Cart_Response } from '../models/Cart';
import { Order } from '../models/Order';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  constructor(private http: HttpClient, private decode: JwtHelperService) { }
  loggedIn: boolean = false;
  ID: number = 0;
  Id: number = 0;
  Name: string | undefined;

  create(orderData: Order): Observable<any> {
    const userID = this.checkLogin();
    const modifiedOrderData = { ...orderData, userID: userID ? userID : null };
  
    console.log(modifiedOrderData);
    return this.http.post<any>(`${api}/Order/CreateOrder`, modifiedOrderData).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        return of({ success: false, message: 'Đã xảy ra lỗi khi tạo đơn hàng' }); // Trả về một đối tượng cho biết lỗi
      })
    );
  }

  checkLogin(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedHeader = this.decode.decodeToken(token);
        this.Id = parseInt(decodedHeader['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], 10);
        this.Name = decodedHeader['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        this.loggedIn = true;
        return this.Id;
      } catch (error) {
        console.error("Error decoding token:", error);
        this.loggedIn = false;
        return null;
      }
    }
    this.loggedIn = false;
    console.log("User is not logged in. Token not found.");
    return null;
  }

  getCartCheckout(): Observable<Cart_Response> { // Chỉ trả về một đối tượng Cart_Response
    const userId = this.checkLogin();
    if (userId == null) {
      return throwError(new Error("User is not logged in"));
    }
    return this.http.get<Cart_Response>(`${api}/Cart/GetCart?userId=${userId}`);
  }
}
