import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetProductsByNameAndColor } from '../models/GetProductsByNameAndColor';
import { GetProducts_Detail_Response } from '../models/GetProducts_Detail'; // Cập nhật kiểu

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private http: HttpClient) { }

  GetProductsByNameAndColor(productName: string, color?: string, size?: string): Observable<GetProductsByNameAndColor> {
    let params = new HttpParams().set('productName', productName);
    if (color) {
      params = params.set('color', color);
    }
    if (size) {
      params = params.set('size', size);
    }
    return this.http.get<GetProductsByNameAndColor>(`${api}/Products/GetProductsByNameAndColor`, { params });
  }

  GetProducts_Detail(id: number): Observable<GetProducts_Detail_Response> {
    let params = new HttpParams().set('productId', id.toString());
    return this.http.get<GetProducts_Detail_Response>(`${api}/Product_Details/GetProducts_Detail`, { params });
  }
}
