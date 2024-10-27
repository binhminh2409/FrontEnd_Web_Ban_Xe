import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Cart } from '../models/Cart';
import { catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Cart_Response } from '../models/Cart';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private decode: JwtHelperService, private authSV: AuthService) { }
  loggedIn: boolean = false;
  Id: number = 0;
  Name: string | undefined;
  carts1: Cart[] = [];

  createCart(productIds: number[], guiId: string | null): Observable<any> {
    const isLoggedIn = this.isLoggedIn();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId: number | null = null;

    if (token) {
      const decodedToken = this.decode.decodeToken(token);
      userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        ? parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
        : null;
    }
    const requestData = productIds.map(id => ({
      userId: userId,
      guiId: guiId,
      ProductIDs: [id]
    }));

    return this.http.post<any>(`${api}/Cart/CreateCart`, requestData, { headers });
  }

  createCartslide(productIds: number[], guiId: string | null): Observable<any> {
    const isLoggedIn = this.isLoggedIn();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId: number | null = null;

    if (token) {
      const decodedToken = this.decode.decodeToken(token);
      userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        ? parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
        : null;
    }
    const requestData = productIds.map(id => ({
      userId: userId,
      guiId: guiId,
      ProductIDs: [id]
    }));

    return this.http.post<any>(`${api}/Cart/CreateCartslide`, requestData, { headers });
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

  getCartFromLocalStorage(): Cart[] {
    // Goi local ra
    const cartCheckout = sessionStorage.getItem('CartCheckout');
    if (cartCheckout) {
      this.carts1 = JSON.parse(cartCheckout) as Cart[];
      console.log("Dữ liệu từ localStorage:", this.carts1);
    } else {
      console.log("Giỏ hàng trống trong localStorage.");
    }
    return this.carts1;
  }

  getCart(userId: string | null, GuId: string | null): Observable<Cart[]> {
    if (userId) {
      return this.http.get<Cart[]>(`${api}/Cart/GetCart?userId=${userId}`);
    } else if (GuId) {
      return this.http.get<Cart[]>(`${api}/Cart/GetCartGuId?GuId=${GuId}`);
    } else {
      return throwError(new Error("User is not logged in and guiId is missing"));
    }
  }

  getCartSl(userId: string | null, GuId: string | null): Observable<Cart_Response> {
    if (userId) {
      return this.http.get<Cart_Response>(`${api}/Cart/GetCart?userId=${userId}`);
    } else if (GuId) {
      return this.http.get<Cart_Response>(`${api}/Cart/GetCartGuId?GuId=${GuId}`);
    } else {
      return throwError(new Error("User is not logged in and guiId is missing"));
    }
  }

  updateQuantity(productId: any, userId: number, action: string): Observable<any> {
    let apiUrl: string;
    if (action === 'increase') {
      apiUrl = `${api}/Cart/IncreaseQuantityShoppingCart?UserId=${userId}&createProductId=${productId}`;
    } else if (action === 'decrease') {
      apiUrl = `${api}/Cart/ReduceShoppingCart?UserId=${userId}&createProductId=${productId}`;
    } else {
      return throwError('Hành động không hợp lệ');
    }
    return this.http.put<any>(apiUrl, {}).pipe(
      catchError(error => {
        console.error('Lỗi khi cập nhật số lượng', error);
        return throwError(error);
      })
    );
  }

  updateQuantityGuiId(productId: any, guiId: string, action: string): Observable<any> {
    let apiUrl: string;
    if (action === 'increase') {
      apiUrl = `${api}/Cart/IncreaseQuantityShoppingCartGuiId?guiId=${guiId}&createProductId=${productId}`;
    } else if (action === 'decrease') {
      apiUrl = `${api}/Cart/ReduceShoppingCartGuiId?guiId=${guiId}&createProductId=${productId}`;
    } else {
      return throwError('Hành động không hợp lệ');
    }
    return this.http.put<any>(apiUrl, {}).pipe(
      catchError(error => {
        console.error('Lỗi khi cập nhật số lượng', error);
        return throwError(error);
      })
    );
  }


  deleteCart(productId: number): Observable<any> {
    const apiUrl = `${api}/Cart/Delete?productId=${productId}`;
    return this.http.delete(apiUrl);
  }

  deleteAllProductsByUser(productIds: number[]): Observable<any> {
    const userId = this.authSV.DecodeToken();
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    if (productIds.length === 0) {
      throw new Error("No product IDs provided");
    }
    const apiUrl = `${api}/Cart/DeleteCartId?userid=${userId}`;
    console.log('API URL:', apiUrl);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: productIds
    };
    return this.http.delete(apiUrl, options);
  }
}
