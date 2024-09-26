import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product_Price } from '../models/Product_Price';
import { Products } from '../models/Produts';

const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${api}/Products/GetAllProduct`);
  }

  getListPrice(minPrice: number, maxPrice: number): Observable<Product_Price[]> {
    // Log để kiểm tra giá trị minPrice và maxPrice
    console.log('Min Price:', minPrice, 'Max Price:', maxPrice);
    
    // Sử dụng HttpParams để tạo tham số cho yêu cầu
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());

    return this.http.get<Product_Price[]>(`${api}/Products/GetListPrice`, { params });
  }
}
