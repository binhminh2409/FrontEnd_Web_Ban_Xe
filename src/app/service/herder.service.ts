import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { connect, Observable } from 'rxjs';
import { ProductSearch } from '../models/ProductSearch';

@Injectable({
  providedIn: 'root'
})
export class HerderService {

  constructor(private http: HttpClient) { }

  searchKey(keyword: string): Observable<ProductSearch[]>{
    const params = new HttpParams()
      .set('keyWord', keyword.toString())
    return this.http.get<ProductSearch[]>(`${environment.apiUrl}api/Products/SearchKey`, { params });
  }  
}
