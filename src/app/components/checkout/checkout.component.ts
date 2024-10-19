import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { Check_Out } from '../../models/Check_Out';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckOutService } from '../../service/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  carts1: Cart[] = [];
  check_Out: Check_Out[] = [];
  checkoutForm: FormGroup;
  constructor(
    private CartSV: CartService,
    private CheckoutSV: CheckOutService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef) {

    this.checkoutForm = this.fb.group({
      payment: this.fb.group({
        ShipName: ['', Validators.required],
        ShipAddress: ['', Validators.required],
        ShipEmail: ['', [Validators.required, Validators.email]],
        ShipPhone: ['', Validators.required],
        paymentMethod: ['', Validators.required] // Add payment method field
      })
    });
  }

  ngOnInit(): void {
    console.log("ngOnInit called");
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      const cartCheckout = sessionStorage.getItem('CartCheckout');
      if (cartCheckout) {
        this.carts1 = JSON.parse(cartCheckout) as Cart[];
        console.log("Dữ liệu từ localStorage:", this.carts1);
      } else {
        console.log("Giỏ hàng trống trong localStorage.");
      }
    } else {
      this.CartSV.getCart().subscribe((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.carts1 = res.data.map((item: any) => {
            return { ...new Cart(), ...item };
          });
          console.log("Dữ liệu từ server:", this.carts1);
        } else {
          console.error("Invalid data format:", res);
        }
      });
    }
    this.cdr.detectChanges(); 
  }


  getImageUrl(data: Cart): string {
    const HostUrl = "https://localhost:5001/api";
    if (data && data.productId) {
      return `${HostUrl}/Products/images/product/${data.productId}`;
    }
    else {
      return "Id not found";
    }
  }

  calculateTotal(): number {
    let total = 0;
    for (let cart of this.carts1) {
      total += cart.totalPrice;
    }
    return total;
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    for (let cart of this.carts1) {
      subtotal += cart.totalPrice;
    }
    return subtotal;
  }
  //thêm dữ liệu bảng order
  cart: Cart[] = [];

  checkoutFormCreate: FormGroup = new FormGroup({
    ShipName: new FormControl(),
    ShipAddress: new FormControl(),
    ShipEmail: new FormControl(),
    ShipPhone: new FormControl(),
  })

  onCreate(): void {
    if (this.checkoutFormCreate.invalid) {
      console.error("Form is invalid");
      return;
    }

    // Trích xuất chỉ ID của sản phẩm từ mảng carts
    const productIds = this.carts1.map(item => item.productId);

    const orderData = {
      ...this.checkoutFormCreate.value,
      cart: productIds // Chỉ truyền mảng ID sản phẩm
    };
    console.log('Order Data:', orderData);

    this.CheckoutSV.create(orderData).subscribe({
      next: (data) => {
        console.log('Response Data:', data);
        const userConfirmed = window.confirm('Order successful, Do you want to move to the Product?');
        if (userConfirmed) {
          // Chuyển hướng đến trang sản phẩm, giả sử đường dẫn là '/product'
          this.router.navigate(['/product']);

          // Gọi hàm xóa giỏ hàng sau khi đặt hàng thành công
          this.CartSV.deleteAllProductsByUser(productIds).subscribe({
            next: () => {
              console.log(productIds);
              console.log('Cart cleared successfully');
            },
            error: (err) => {
              console.error("Error clearing cart:", err);
            }
          });
        }
      },
      error: (err) => {
        console.error("Error creating order:", err);
      }
    });
  }
}