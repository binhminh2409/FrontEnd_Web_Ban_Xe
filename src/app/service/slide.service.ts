import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  constructor(private http: HttpClient) {}

  getSlide(): Observable<any[]> {
    return this.http.get<any[]>(`${api}/Slide/GetList`);
  }
}
