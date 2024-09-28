import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product_Price } from '../models/Product_Price';
import { Products } from '../models/Produts';
import { ProductResponse } from '../models/Product_Price';
const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${api}/Products/GetAllProduct`);
  }

  getListPrice(minPrice: number, maxPrice: number, brandsName: string): Observable<ProductResponse> {
    console.log('Min Price:', minPrice, 'Max Price:', maxPrice);
    
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString())
      .set('brandsName', brandsName);

    return this.http.get<ProductResponse>(`${api}/Products/GetProductsWithinPriceRangeAndBrand`, { params });
  }
}
