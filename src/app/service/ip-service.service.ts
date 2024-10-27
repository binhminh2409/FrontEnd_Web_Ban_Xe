import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {
  private ipApiUrl = 'https://api.ipify.org?format=json';

  constructor(private http: HttpClient) { }

  getIpAddress() {
    return this.http.get<{ip: string}>(this.ipApiUrl);
  }
}
