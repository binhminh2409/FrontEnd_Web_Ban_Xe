import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  constructor(private http: HttpClient, private decode: JwtHelperService) { }
  loggedIn: boolean = false;
  ID: number = 0;

  create(orderData: any): Observable<any> {
    const userID = this.checkLogin();
    if (!userID) {
      console.error("User not logged in.")
      return throwError("User not logged in.");
    }
    const modifiedOrderData = { ...orderData }
    modifiedOrderData.userID = userID;
    console.log(modifiedOrderData);
    return this.http.post<any>(`${api}/Order/CreateOrder`, modifiedOrderData)
  }

  checkLogin(): number | null {
    let token = localStorage.getItem('token');
    if (token) {
      const decodedHeader = this.decode.decodeToken(token);
      const userIdFromToken = decodedHeader.Id;
      console.log("Id", userIdFromToken);
      this.loggedIn = true;
      return Number(userIdFromToken);
    }
    this.loggedIn = false;
    return null;
  }
}
