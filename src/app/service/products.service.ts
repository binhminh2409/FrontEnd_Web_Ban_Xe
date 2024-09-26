import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../models/Produts'; 

const api = 'https://localhost:7066/api'
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${api}/Products/GetAllProduct`);
  }

  getListPrice(minPrice: number,maxPrice: number): Observable<Products[]>{
    console.log(minPrice,maxPrice);
    return this.http.get<Products[]>(`${api}/Products/GetListPrice`,{
      params:{
        minPrice, maxPrice
      }
    });
  }
}
