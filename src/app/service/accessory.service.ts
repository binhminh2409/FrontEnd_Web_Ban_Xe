import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseType } from '../models/ProductType';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class AccessoryService {

  constructor(private http: HttpClient) { }

  getProductType(keyword: string = 'Phụ Kiện'): Observable<ProductResponseType> {
    let params = new HttpParams()
      .set('productType', keyword);
    return this.http.get<ProductResponseType>(`${api}/Products/GetViewProductType`, { params });
  }

  getProductName(keyword: string): Observable<ProductResponseType> {
    let params = new HttpParams()
      .set('productName', keyword);
    return this.http.get<ProductResponseType>(`${api}/Products/GetProductName`, { params });
  }
}
