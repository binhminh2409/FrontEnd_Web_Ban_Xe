import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductGetTypeName } from '../models/ProductGetTypeName';
import { Observable } from 'rxjs';


const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  productsXemoive(limit: number = 4, keyword: string = 'Xe mới về'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }

  productsXetreem(limit: number = 4, keyword: string = 'Xe trẻ em'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }
}
