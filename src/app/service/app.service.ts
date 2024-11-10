import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductGetTypeName, ApiResponse } from '../models/ProductGetTypeName';
import { Observable } from 'rxjs';
import { SlideAds } from '../models/SlideAds';


const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  productsXedapdiahinh(limit: number = 4, keyword: string = 'Xe đạp địa hình'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }

  ListOfBestSellingProducts(): Observable<ApiResponse<ProductGetTypeName>> {
    return this.http.get<ApiResponse<ProductGetTypeName>>(`${api}/Order/ListOfBestSellingProducts`);
  }

  productsXetreem(limit: number = 4, keyword: string = 'Xe trẻ em'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }

  productsXedapnu(limit: number = 4, keyword: string = 'Xe đạp nữ'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }

  productsXedapthethaoduongpho(limit: number = 4, keyword: string = 'Xe đạp thể thao đường phố'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }

  productsXedapdua(limit: number = 4, keyword: string = 'Xe đạp đua'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('keyword', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetTypeName`, { params });
  }

  productsPKCNDapXe(keyword: string = 'Phụ kiện cho người đạp xe'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('productType', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetViewProductType`, { params });
  }

  productsPhukienchoxe(keyword: string = 'Phụ kiện cho xe'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('productType', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetViewProductType`, { params });
  }

  ProductsPhutung(keyword: string = 'Phụ Tùng'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('productType', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetViewProductType`, { params });
  }

  SlideXeDapTreEm(keyword: string = 'Xe Đạp Trẻ Em Youth MAX BIKE Mikki 14 - Bánh 14 Inches'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlideXeDapDiaHinh(keyword: string = 'Xe Đạp Địa Hình MTB GIANT Talon 29 4 - Phanh Đĩa, Bánh 29 Inches - 2024'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlideXeDapNu(keyword: string = 'Xe Đạp Đường Phố Touring VINBIKE Eva - Bánh 26 Inches'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlideXeTTDuongPho(keyword: string = 'Xe Đạp Đường Phố Touring GIANT Fastroad Advanced 2 – Phanh Đĩa, Bánh 700C – 2024'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlideXeDua(keyword: string = 'Xe Đạp Đua Đường Trường Road GIANT Speeder-D1 – Phanh Đĩa, Bánh 700C – 2023'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlidePkXe(keyword: string = 'Đèn Trước Xe Đạp Pin AAA 60 Lumen BOSHING BS04 Bicycle Front Light'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlideTBTLuyen(keyword: string = 'Thiết Bị Tập Luyện Đạp Xe GARMIN Tacx Neo 3M'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlidePhuTung(keyword: string = 'Ruột Xe Đạp GIANT 700×35-45 SV 35mm – Innertube And Valve'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  SlidePKCNDapXe(keyword: string = 'Nón Bảo Hiểm Xe Đạp GIANT Path Mips Adult Helmet'): Observable<SlideAds[]> {
    let params = new HttpParams()
      .set('slideName', keyword);

    return this.http.get<SlideAds[]>(`${api}/Slide/SlideName`, { params });
  }

  getBoSuuTapXeDap(keyword: string = 'BỘ SƯU TẬP XE ĐẠP 2024'): Observable<ProductGetTypeName[]> {
    let params = new HttpParams()
      .set('productType', keyword);

    return this.http.get<ProductGetTypeName[]>(`${api}/Products/GetViewBoSuuTap`, { params });
  }
}
