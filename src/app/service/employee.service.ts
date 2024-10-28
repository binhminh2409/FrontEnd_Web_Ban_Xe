import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:5001/api/Admin'; // Đường dẫn API

  constructor(private http: HttpClient) { }

  // Hàm để lấy danh sách nhân viên
  getEmployees(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/GetEmployees`, { headers });
  }

  // Hàm xóa nhân viên theo email
  deleteEmployee(email: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/DeleteEmployee/${email}`;
    return this.http.delete<any>(url, { headers });
  }
}
