import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  Name: string = '';

  login(loginData: { email: string; password: string; }): Observable<any> {
    console.log(loginData);
    return this.http.post(`${api}/User/Login`, loginData, { responseType: 'text' });
  }

  checkLogin(): boolean {
    const locaData = localStorage.getItem('token');
    if (locaData) {
      const decodedHeader = this.jwtHelper.decodeToken(locaData);
      this.Name = decodedHeader.Name;
      console.log(this.Name);
      return true; // The user is logged in if there is a token
    }
    return false;
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    city: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
  }): Observable<any> {
    console.log(userData);
    return this.http.post(`${api}/User/Create`, userData);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  
    return this.http.post(`${api}/User/logout`, {}, { headers, responseType: 'text' })
      .pipe(
        tap(response => {
          console.log(response);
          localStorage.removeItem('token'); // Xóa token
          window.location.reload(); // Tải lại trang
        }),
        catchError(error => {
          console.error('Error logging out', error);
          return throwError(error);
        })
      );
  }
}
