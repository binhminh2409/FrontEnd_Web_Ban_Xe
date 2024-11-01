import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { IpServiceService } from '../../service/ip-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];

  constructor(private cartSv: CartService, private authService: AuthService, private ipSV: IpServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getFormattedPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')} đ`;
  }

  loadCheckoutData(): void {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      // Người dùng chưa đăng nhập, lấy IP để làm guiId
      this.ipSV.getIpAddress().subscribe(
        (response: { ip: string }) => {
          const guiId = response.ip;

          const cartCheckout = sessionStorage.getItem('CartCheckout');
          if (cartCheckout) {
            console.log('Cart data found in session storage');
            this.carts = JSON.parse(cartCheckout) as Cart[];
          } else {
            this.cartSv.getCart(null, guiId).subscribe(
              (res: any) => {
                if (res?.data && Array.isArray(res.data)) {
                  this.carts = res.data.map((item: any) => {
                    return { ...new Cart(), ...item };
                  });
                }
              },
              (error) => {
                console.error('Error response from getCart API for guest user:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error while retrieving IP address:', error);
          alert('Không thể lấy địa chỉ IP. Vui lòng thử lại.');
        }
      );
    } else {
      const userId = this.authService.DecodeToken();
      console.log('User ID from decoded token:', userId);

      this.cartSv.getCart(userId, null).subscribe(
        (res: any) => {
          console.log('Response from getCart API for logged-in user:', res);
          if (res?.data && Array.isArray(res.data)) {
            this.carts = res.data.map((item: any) => {
              return { ...new Cart(), ...item };
            });
          }
        },
        (error) => {
          console.error('Error response from getCart API for logged-in user:', error);
        }
      );
    }
  }

  getImageUrl(data: Cart): string {
    const HostUrl = "https://localhost:5001/api";
    if (data && data.productId) {
      return `${HostUrl}/Products/images/product/${data.productId}`;
    } else {
      return '';
    }
  }

  calculateTotal(): number {
    let total = 0;
    for (let cart of this.carts) {
      total += cart.totalPrice;
    }
    return total;
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    for (let cart of this.carts) {
      subtotal += cart.totalPrice;
    }
    return subtotal;
  }

  increaseQuantity(cartItem: Cart) {
    console.log('CartItem:', cartItem);
    console.log('productId:', cartItem.productId);

    const userId = this.cartSv.checkLogin();
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      // Người dùng đã đăng nhập
      if (cartItem.productId && userId !== null) {
        this.cartSv.updateQuantity(cartItem.productId, userId, 'increase').subscribe(
          () => {
            this.loadCheckoutData();
          },
          error => {
            console.error("Lỗi khi tăng số lượng sản phẩm:", error);
          }
        );
      } else {
        console.error("Không xác định được userId hoặc productId:", cartItem);
      }
    } else {
      // Người dùng chưa đăng nhập, lấy địa chỉ IP
      this.ipSV.getIpAddress().subscribe(
        (response: { ip: string }) => {
          const guiId = response.ip;
          if (cartItem.productId) {
            this.cartSv.updateQuantityGuiId(cartItem.productId, guiId, 'increase').subscribe(
              () => {
                this.loadCheckoutData();
              },
              error => {
                console.error("Lỗi khi tăng số lượng sản phẩm (không đăng nhập):", error);
              }
            );
          } else {
            console.error("productId không được xác định cho cartItem:", cartItem);
          }
        },
        error => {
          console.error("Không thể lấy địa chỉ IP:", error);
        }
      );
    }
  }

  decreaseQuantity(cartItem: Cart) {
    const userId = this.cartSv.checkLogin();
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      // Người dùng đã đăng nhập
      if (cartItem.productId && userId !== null) {
        this.cartSv.updateQuantity(cartItem.productId, userId, 'decrease').subscribe(
          () => {
            this.loadCheckoutData();
          },
          error => {
            console.error("Lỗi khi giảm số lượng sản phẩm:", error);
          }
        );
      } else {
        console.error("Không xác định được userId hoặc productId:", cartItem);
      }
    } else {
      // Người dùng chưa đăng nhập, lấy địa chỉ IP
      this.ipSV.getIpAddress().subscribe(
        (response: { ip: string }) => {
          const guiId = response.ip;
          if (cartItem.productId) {
            this.cartSv.updateQuantityGuiId(cartItem.productId, guiId, 'decrease').subscribe(
              () => {
                this.loadCheckoutData();
              },
              error => {
                console.error("Lỗi khi giảm số lượng sản phẩm (không đăng nhập):", error);
              }
            );
          } else {
            console.error("productId không được xác định cho cartItem:", cartItem);
          }
        },
        error => {
          console.error("Không thể lấy địa chỉ IP:", error);
        }
      );
    }
  }

  deleteCartItem(productId: number) {
    this.cartSv.deleteCart(productId).subscribe(
      response => {
        this.carts = this.carts.filter(cart => cart.productId !== productId);
        this.loadCheckoutData();
      },
      error => {
        console.error('Có vấn đề với yêu cầu xóa:', error);
      }
    );
  }

  clearLocalCart() {
    localStorage.removeItem('tempCart');
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
} 
