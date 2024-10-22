import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckOutService } from '../../service/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Order } from '../../models/Order';

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
    private cdr: ChangeDetectorRef) {

    this.checkoutForm = this.fb.group({
      ShipName: ['', Validators.required],
      ShipAddress: ['', Validators.required],
      ShipEmail: ['', [Validators.required, Validators.email]],
      ShipPhone: ['', Validators.required],
      payment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  loadCheckoutData(): void {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      const cartCheckout = sessionStorage.getItem('CartCheckout');
      if (cartCheckout) {
        this.carts = JSON.parse(cartCheckout) as Cart[];
      }
    } else {
      this.cartService.getCart().subscribe((res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.carts = res.data.map((item: any) => {
            return { ...new Cart(), ...item };
          });
        }
      });
    }

    this.cdr.detectChanges();
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
  
    const orderData: Order = {
      userID: null,
      ...this.checkoutForm.value,
      cart: this.carts.map(item => item.productId)
    };
  
    try {
      const response = await this.checkoutService.create(orderData).toPromise();
      
      if (response && response.success) {
        const userConfirmed = window.confirm('Đơn hàng đã được tạo thành công. Bạn có muốn chuyển đến sản phẩm không?');
        if (userConfirmed) {
          await this.router.navigate(['/product']);
          await this.cartService.deleteAllProductsByUser(orderData.cart).toPromise();
          console.log('Giỏ hàng đã được xóa thành công');
        }
      } else {
        console.error("Đã xảy ra lỗi khi tạo đơn hàng:", response.message || 'Lỗi không xác định');
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  }
}
