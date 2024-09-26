import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Cart } from '../models/Cart';
import { HttpParams } from '@angular/common/http';



const api = 'https://localhost:7066/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private decode: JwtHelperService) { }
  loggedIn: boolean = false;
  Id: number = 0;
  Name: string | undefined;

  createCart(productIds: number[]): Observable<any> {
    const isLoggedIn = this.isLoggedIn();
    if (!isLoggedIn) {
      return throwError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userId = this.checkLogin();
    const requestData = productIds.map(id => ({ userId: userId !== null ? parseInt(userId.toString()) : null, ProductIDs: [id] }));
    console.log(requestData);
    console.log(headers);
    console.log(token);
    return this.http.post<any>(`${api}/Cart/CreateCart`, requestData, { headers });
  }

  checkLogin(): number | null {
    let token = localStorage.getItem('token');
    if (token) {
      const decodedHeader = this.decode.decodeToken(token);
      this.Id = parseInt(decodedHeader.Id, 10); // Sử dụng trường "user_id" để lấy ID của người dùng
      this.Name = decodedHeader.Name;
      console.log("Name:", this.Name);
      console.log("Id:", this.Id);
      this.loggedIn = true; // Đã đăng nhập thành công
      return this.Id;
    }
    this.loggedIn = false; // Chưa đăng nhập hoặc token không tồn tại
    return null; // Trả về null nếu không tìm thấy ID
  }

  isLoggedIn(): boolean {
    const locaData = localStorage.getItem('token');
    // Kiểm tra xem dữ liệu tồn tại và có giá trị hợp lệ không
    return locaData !== null && locaData.trim() !== '';
  }
  getCart(): Observable<Cart[]> {
    const userId = this.checkLogin(); // Lấy userId từ hàm checkLogin
    if (userId == null) {
      throw new Error("User is not logged in");
    }
    return this.http.get<Cart[]>(`${api}/Cart/GetCart?userId=${userId}`);
  }

  // Phương thức để gọi API cập nhật số lượng
  updateQuantity(cartItem: any, userId: number, action: string) {
    console.log('UserId:', userId);
    console.log('ProductID:', cartItem.productID);
    console.log('Action:', action);

    let apiUrl: string;

    if (action === 'increase') {
      apiUrl = `${api}/Cart/ReduceShoppingCart?UserId=${userId}&createProductId=${cartItem.productID}`;
    } else if (action === 'decrease') {
      apiUrl = `${api}/Cart/IncreaseQuantityShoppingCart?UserId=${userId}&createProductId=${cartItem.productID}`;
    } else {
      console.error('Hành động không hợp lệ');
      return;
    }

    // Gọi API để cập nhật số lượng
    this.http.put<any>(apiUrl, {}).subscribe(response => {
      console.log('Đã cập nhật số lượng thành công', response);
    }, error => {
      console.error('Lỗi khi cập nhật số lượng', error);
    });
  }

  deleteCart(cartId: number): Observable<any> {
    const apiUrl = `${api}/Cart/Delete?id=${cartId}`; // Sử dụng ?cartId=${cartId} để thêm cartId vào query string
    return this.http.delete(apiUrl);
  }

  deleteAllProductsByUser(productIds: number[]): Observable<any> {
    const userid = this.checkLogin();
    console.log('Product IDs:', productIds);
    if (userid == null) {
      throw new Error("User is not logged in");
    }
    if (!Number.isInteger(userid)) {
      throw new Error("User ID is not a valid integer");
    }
    if (productIds.length === 0) {
      throw new Error("No product IDs provided");
    }

    const apiUrl = `${api}/Cart/DeleteCartId`;

    // Sử dụng HttpParams để xây dựng tham số truy vấn cho userid
    const params = new HttpParams().set('userid', userid);

    console.log('API URL:', apiUrl);
    console.log('Params:', params);

    // Xây dựng yêu cầu xóa với dữ liệu body chứa productIds
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: params,
      body: productIds
    };
    return this.http.delete(apiUrl, options);
  }
}
