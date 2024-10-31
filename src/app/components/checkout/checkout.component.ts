import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckOutService } from '../../service/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Order } from '../../models/Order';
import { IpServiceService } from '../../service/ip-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  carts: Cart[] = [];
  checkoutForm: FormGroup;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckOutService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ipSV: IpServiceService
  ) {

    this.checkoutForm = this.fb.group({
      shipName: ['', Validators.required],
      shipAddress: ['', Validators.required],
      shipEmail: ['', [Validators.required, Validators.email]],
      shipPhone: ['', Validators.required],
      payment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
            this.cartService.getCart(null, guiId).subscribe(
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

      this.cartService.getCart(userId, null).subscribe(
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

  getImageUrl(cart: Cart): string {
    const hostUrl = "https://localhost:5001/api";
    return cart?.productId ? `${hostUrl}/Products/images/product/${cart.productId}` : "Id not found";
  }

  calculateTotal(): number {
    return this.carts.reduce((total, cart) => total + cart.totalPrice, 0);
  }

  async onCreate(): Promise<void> {
    if (this.checkoutForm.invalid) {
      console.error("Form is invalid");
      return;
    }

    const userID = this.authService.isLoggedIn();
    const orderData: Order = {
      userID: userID ? userID : null,
      ...this.checkoutForm.value,
      cart: this.carts.map(item => item.productId)
    };

    try {
      const response = await this.checkoutService.create(orderData).toPromise();
      console.log(response);

      if (response && response.success) {
        try {
          // Xóa từng sản phẩm trong giỏ hàng
          for (const productId of orderData.cart) {
            await this.cartService.deleteCart(productId).toPromise();
          }
          console.log('Giỏ hàng đã được xóa thành công');

          const userConfirmed = window.confirm('Unit created successfully. Would you like to go to product?');
          if (userConfirmed) {
            await this.router.navigate(['/product']);
          }
        } catch (deleteError) {
          console.error("Error deleting cart:", deleteError);
        }
      } else {
        console.error("Đã xảy ra lỗi khi tạo đơn hàng:", response.message || 'Lỗi không xác định');
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  }
}
