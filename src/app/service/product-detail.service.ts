import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetProductsByNameAndColor } from '../models/GetProductsByNameAndColor';

const api = 'https://localhost:7066/api';
@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private http: HttpClient) { }

  GetProductsByNameAndColor(productName: string, color: string): Observable<GetProductsByNameAndColor>{

    const params = new HttpParams()
      .set('productName', productName)
      .set('color', color)
    return this.http.get<GetProductsByNameAndColor>(`${api}/Products/GetProductsByNameAndColor`,{params });
  }
}
