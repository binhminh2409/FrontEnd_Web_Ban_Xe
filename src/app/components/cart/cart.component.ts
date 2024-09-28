import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { JsonpInterceptor } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];

  constructor(private cartSv: CartService) { }

  ngOnInit(): void {
    this.loadCartData(); // Tải dữ liệu giỏ hàng khi khởi tạo
  }

  getFormattedPrice(price: number): string {
    // Chuyển đổi giá sang định dạng tiền tệ mà không có chữ "đ" ở đầu
    return `${price.toLocaleString('vi-VN')} đ`;
  }

  loadCartData(): void {
    const userId = this.cartSv.checkLogin();

    if (userId) {
      // Người dùng đã đăng nhập, lấy giỏ hàng từ server
      this.cartSv.getCart().subscribe((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.carts = res.data;
          console.log(this.carts);
        } else {
          console.error("Invalid data format:", res);
        }
      });
    } else {
      // Người dùng chưa đăng nhập, lấy giỏ hàng từ LocalStorage
      const localCart = localStorage.getItem('tempCart');
      console.log(localCart);
      if (localCart) {
        this.carts = JSON.parse(localCart);
        console.log('Giỏ hàng từ LocalStorage:', this.carts);

        // Gọi hàm để lấy URL ảnh cho mỗi sản phẩm trong giỏ hàng
        this.carts.forEach((item: Cart) => {
          item.totalPrice = item.priceProduct * item.quantity;
          const imageUrl = this.getImageUrl(item);
          console.log('Image URL for product:', item.productId, 'is', imageUrl);
        });
      } else {
        console.log('Không có giỏ hàng trong LocalStorage');
      }
    }
  }

  getImageUrl(data: Cart): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.productId) {
      return `${HostUrl}/Products/images/product/${data.productId}`;
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

  increaseQuantity(cartItem: Cart) {
    const userId = this.cartSv.checkLogin(); // Lấy userId từ hàm checkLogin
    if (userId) {
      this.cartSv.updateQuantity(cartItem, userId, 'increase').subscribe(() => {
        this.loadCartData();
      })
    }
    else {
      cartItem.quantity += 1;
      cartItem.totalPrice = cartItem.priceProduct * cartItem.quantity;
      const localCart = JSON.parse(localStorage.getItem('temCart') || '[]');
      const updatedCart = localCart.map((item: Cart) =>
        item.cartId === cartItem.cartId ? cartItem : item
      );
      localStorage.setItem('tempCart', JSON.stringify(updatedCart));
      console.log('Cập nhật giỏ hàng LocalStorage:', updatedCart);
    }
  }

  decreaseQuantity(cartItem: Cart) {
    const userId = this.cartSv.checkLogin(); // Lấy userId từ hàm checkLogin
    if (userId) {
      // Nếu người dùng đã đăng nhập
      this.cartSv.updateQuantity(cartItem, userId, 'decrease').subscribe(() => {
        this.loadCartData(); // Tải lại dữ liệu giỏ hàng sau khi cập nhật
      });
    } else {
      // Nếu người dùng chưa đăng nhập
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1; // Giảm số lượng sản phẩm nếu lớn hơn 1
        cartItem.totalPrice = cartItem.priceProduct * cartItem.quantity; // Cập nhật tổng giá
        const localCart = JSON.parse(localStorage.getItem('tempCart') || '[]'); // Lấy giỏ hàng từ LocalStorage
        const updatedCart = localCart.map((item: Cart) =>
          item.cartId === cartItem.cartId ? cartItem : item // Cập nhật sản phẩm trong giỏ hàng
        );
        localStorage.setItem('tempCart', JSON.stringify(updatedCart)); // Lưu giỏ hàng vào LocalStorage
        console.log('Cập nhật giỏ hàng LocalStorage:', updatedCart);
      } else {
        console.log('Không thể giảm số lượng sản phẩm dưới 1.');
      }
    }
  }

  deleteCartItem(cartId: number) {
    const userId = this.cartSv.checkLogin();
    if (userId) {
      // Xóa mục trong giỏ hàng trên server
      this.cartSv.deleteCart(cartId).subscribe(
        response => {
          console.log('Xóa mục trong giỏ hàng thành công:', response);
          this.loadCartData(); // Tải lại dữ liệu giỏ hàng sau khi xóa thành công
        },
        error => {
          console.error('Có vấn đề với yêu cầu xóa:', error);
        }
      );
    } else {
      // Xóa mục trong giỏ hàng LocalStorage
      const localCart = this.carts.filter(cart => cart.cartId !== cartId);
      localStorage.setItem('cart', JSON.stringify(localCart));
      this.carts = localCart;
      console.log('Xóa mục trong giỏ hàng LocalStorage:', cartId);
    }
  }
}
