import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileResponse } from '../models/my-profile';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UpdateUserDto } from '../models/UpdateUserDto';
import { ImageUserResponse } from '../models/ImageUser';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  getMyProfile(Id: number): Observable<UserProfileResponse> {
    let params = new HttpParams().set('userId', Id.toString());
    return this.http.get<UserProfileResponse>(`${api}/User/GetViewUser`, { params });
  }

  getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';  // Nếu không có token, trả về chuỗi rỗng
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.Id || ''; // Trả về ID từ token
  }

  updateUser(userId: number, updateUserDto: UpdateUserDto): Observable<any> {
    return this.http.put(`${api}/User/UpdateViewUser?userId=${userId}`, updateUserDto);
  }

  updateImage(userId: number, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', imageFile);
    return this.http.put(`${api}/User/UpdateImage?userId=${userId}`, formData);
  }

  GetImage(userId: number): Observable<ImageUserResponse> {
    return this.http.get<ImageUserResponse>(`${api}/User/GetImage?userId=${userId}`);
  }
}
