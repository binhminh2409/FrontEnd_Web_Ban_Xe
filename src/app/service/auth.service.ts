import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  constructor() { }

  // Hàm lấy tên người dùng từ token
  getUserNameFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';
  }


  DecodeToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return userId || '';
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const isValidToken = !!token && !this.jwtHelper.isTokenExpired(token);
    return isValidToken; 
  }

  getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    if (!userId) {
      console.error('User ID not found in decoded token');
      return '';
    }
    return userId;
  }
}
