import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const api = 'https://localhost:5001/api';
@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  constructor(private http: HttpClient) { }

  helper = new JwtHelperService();
  Name: string = '';

  login(loginData: { email: string, password: string }) {
    console.log(loginData);
    return this.http.post(`${api}/User/Login`, loginData, { responseType: 'text' });
  }

  checkLogin(): boolean {
    let locaData = localStorage.getItem('token');
    if (locaData) {
      console.log(locaData);
      const decodedHeader = this.helper.decodeToken(locaData);
      this.Name = decodedHeader.Name;
      console.log(this.Name);
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
