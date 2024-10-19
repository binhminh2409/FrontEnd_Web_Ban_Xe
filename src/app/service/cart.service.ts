import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Cart } from '../models/Cart';
import { HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private decode: JwtHelperService) { }
  loggedIn: boolean = false;
  Id: number = 0;
  Name: string | undefined;

  createCart(productIds: number[]): Observable<any> {
    const isLoggedIn = this.isLoggedIn();
    if (!isLoggedIn) {
      return throwError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId: number | null = null;
    let decodedToken: any = null;
    if (token) {
      decodedToken = this.decode.decodeToken(token);
      userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?
        parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']) : null;
    }
    const requestData = productIds.map(id => ({
      userId: userId,
      ProductIDs: [id]
    }));
    return this.http.post<any>(`${api}/Cart/CreateCart`, requestData, { headers });
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

  isLoggedIn(): boolean {
    const locaData = localStorage.getItem('token');
    return locaData !== null && locaData.trim() !== '';
  }

  getCart(): Observable<Cart[]> {
    const userId = this.checkLogin();
    if (userId == null) {
      return throwError(new Error("User is not logged in"));
    }
    return this.http.get<Cart[]>(`${api}/Cart/GetCart?userId=${userId}`);
  }

  updateQuantity(productId: any, userId: number, action: string): Observable<any> {
    let apiUrl: string;
    if (action === 'increase') {
      apiUrl = `${api}/Cart/IncreaseQuantityShoppingCart?UserId=${userId}&createProductId=${productId}`;
    } else if (action === 'decrease') {
      apiUrl = `${api}/Cart/ReduceShoppingCart?UserId=${userId}&createProductId=${productId}`;
    } else {
      console.error('Hành động không hợp lệ');
      return throwError('Hành động không hợp lệ');
    }
    return this.http.put<any>(apiUrl, {}).pipe(
      tap(response => {
        console.log('Đã cập nhật số lượng thành công', response);
      }),
      catchError(error => {
        console.error('Lỗi khi cập nhật số lượng', error);
        return throwError(error);
      })
    );
  }


  deleteCart(cartId: number): Observable<any> {
    const apiUrl = `${api}/Cart/Delete?id=${cartId}`;
    return this.http.delete(apiUrl);
  }

  deleteAllProductsByUser(productIds: number[]): Observable<any> {
    const userid = this.checkLogin();
    console.log('Product IDs:', productIds);
    if (userid == null) {
      throw new Error("User is not logged in");
    }
    if (!Number.isInteger(userid)) {
      throw new Error("User ID is not a valid integer");
    }
    if (productIds.length === 0) {
      throw new Error("No product IDs provided");
    }
    const apiUrl = `${api}/Cart/DeleteCartId`;
    const params = new HttpParams().set('userid', userid);
    console.log('API URL:', apiUrl);
    console.log('Params:', params);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: params,
      body: productIds
    };
    return this.http.delete(apiUrl, options);
  }

  
}
