import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const api = 'https://localhost:7066/api';
@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private http: HttpClient) { }

  getProductDetail(id: number){
    
  }
}
