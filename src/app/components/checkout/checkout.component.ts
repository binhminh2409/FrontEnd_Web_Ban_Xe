import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { Check_Out } from '../../models/Check_Out';
import { FormControl, FormGroup } from '@angular/forms';
import { CheckOutService } from '../../service/checkout.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  carts: Cart[] = [];
  check_Out: Check_Out[] = [];
  constructor(private CartSV: CartService, private CheckoutSV: CheckOutService, private router: Router) { }

  ngOnInit(): void {
    this.CartSV.getCart().subscribe((res: any) => {
      if (res && res.data && Array.isArray(res.data)) {
        this.carts = res.data
        console.log(this.carts)
      }
      else {
        console.error("Invalid data format:", res);
      }
    })
  }

  getImageUrl(data: Cart): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.productId) {
      return `${HostUrl}/Products/images/product/${data.productId}`;
    }
    else {
      return "Id not found";
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
    const productIds = this.carts.map(item => item.productId);

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
