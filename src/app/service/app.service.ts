import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  productsXemoive(limit: number = 4, keyword: string = 'Xe mới về'): any {
    // Tạo một đối tượng HttpParams để chứa các tham số truy vấn
    let params = new HttpParams();
    params = params.append('limit', limit.toString());
    params = params.append('keyword', keyword);

    // Sử dụng HttpParams để gửi các tham số truy vấn trong yêu cầu HTTP
    return this.http.get<any>(`${api}/Products/GetTypeName`, { params: params });
  }

  productsXetreem(limit: number = 4, keyword: string = 'Xe trẻ em'): any {
    // Tạo một đối tượng HttpParams để chứa các tham số truy vấn
    let params = new HttpParams();
    params = params.append('limit', limit.toString());
    params = params.append('keyword', keyword);

    // Sử dụng HttpParams để gửi các tham số truy vấn trong yêu cầu HTTP
    return this.http.get<any>(`${api}/Products/GetTypeName`, { params: params });
  }
}
