import { HttpClient, HttpParams } from '@angular/common/http'; // Thêm HttpParams vào import
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Slide } from '../models/Slide';
import { AdsModel } from '../models/Ads';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';  // Import catchError from rxjs/operators
import { throwError } from 'rxjs';  // Import throwError from rxjs


const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  constructor(private http: HttpClient) {}

  getSlide(): Observable<any[]> {
    return this.http.get<any[]>(`${api}/Slide/GetList`);
  }

  getSlide2(Id: number = 2): Observable<Slide[]> {
    let params = new HttpParams()
      .set('Id', Id.toString());
    return this.http.get<Slide[]>(`${api}/Slide/GetById`, { params });
  }

  getSlide3(Id: number = 3): Observable<Slide[]> {
    let params = new HttpParams()
      .set('Id', Id.toString());
    return this.http.get<Slide[]>(`${api}/Slide/GetById`, { params });
  }

  getAllAds(): Observable<AdsModel[]> {
    return this.http.get<AdsModel[]>(`${environment.apiUrl}api/Ads/GetAll`)
      .pipe(
        catchError(error => {
          console.error('Error fetching ads:', error);
          return throwError(() => new Error('Error fetching ads'));
        })
      );
  }
}
