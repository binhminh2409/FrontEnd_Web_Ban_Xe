import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];

  constructor(private cartSv: CartService) { }

  ngOnInit(): void {
    this.cartSv.getCart().subscribe((res: any) => {
      if (res && res.data && Array.isArray(res.data)) {
        this.carts = res.data
        console.log(this.carts)
      }
      else {
        console.error("Invalid data format:", res);
      }
    });
  }

  getImageUrl(data: Cart): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.productID) {
      return `${HostUrl}/Products/images/product/${data.productID}`;
    } else {
      return ''; // hoặc bạn có thể trả về một đường dẫn mặc định nếu không có ProductID
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

   // Hàm này sẽ được gọi khi người dùng nhấn vào dấu cộng
  increaseQuantity(cartItem: any) {
    const userId = this.cartSv.checkLogin(); // Lấy userId từ hàm checkLogin
    if (userId === null) {
      console.error('Người dùng chưa đăng nhập');
      return;
    }
    this.cartSv.updateQuantity(cartItem, userId, 'decrease');
    window.location.reload();
  }

  // Hàm này sẽ được gọi khi người dùng nhấn vào dấu trừ
  decreaseQuantity(cartItem: any) {
    const userId = this.cartSv.checkLogin(); // Lấy userId từ hàm checkLogin
    if (userId === null) {
      console.error('Người dùng chưa đăng nhập');
      return;
    }
    this.cartSv.updateQuantity(cartItem, userId, 'increase');
    window.location.reload();
  }

  deleteCartItem(cartId: number) {
    this.cartSv.deleteCart(cartId).subscribe(
      response => {
        console.log('Xóa mục trong giỏ hàng thành công:', response);
        window.location.reload(); // Reload lại trang sau khi xóa thành công
      },
      error => {
        console.error('Có vấn đề với yêu cầu xóa:', error);
        // Xử lý trường hợp lỗi
      }
    );
  }
}
