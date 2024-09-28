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
    this.loadCartData();
  }

  getFormattedPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')} đ`;
  }

  loadCartData(): void {
    const userId = this.cartSv.checkLogin();
    if (userId) {
      this.cartSv.getCart().subscribe((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.carts = res.data;
          console.log(this.carts);
        } else {
          console.error("Invalid data format:", res);
        }
      });
    } else {
      const localCart = localStorage.getItem('tempCart');
      console.log(localCart);
      if (localCart) {
        this.carts = JSON.parse(localCart);
        console.log('Giỏ hàng từ LocalStorage:', this.carts);
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
    const userId = this.cartSv.checkLogin();
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
    const userId = this.cartSv.checkLogin();
    if (userId) {
      this.cartSv.updateQuantity(cartItem, userId, 'decrease').subscribe(() => {
        this.loadCartData();
      });
    } else {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        cartItem.totalPrice = cartItem.priceProduct * cartItem.quantity;
        const localCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
        const updatedCart = localCart.map((item: Cart) =>
          item.cartId === cartItem.cartId ? cartItem : item
        );
        localStorage.setItem('tempCart', JSON.stringify(updatedCart));
        console.log('Cập nhật giỏ hàng LocalStorage:', updatedCart);
      } else {
        console.log('Không thể giảm số lượng sản phẩm dưới 1.');
      }
    }
  }

  deleteCartItem(productId: number) {
    const userId = this.cartSv.checkLogin();

    if (userId) {
      this.cartSv.deleteCart(productId).subscribe(
        response => {
          console.log('Xóa sản phẩm trong giỏ hàng trên server thành công:', response);
          this.carts = this.carts.filter(cart => cart.productId !== productId);
          this.loadCartData();
        },
        error => {
          console.error('Có vấn đề với yêu cầu xóa:', error);
        }
      );
    } else {
      let localCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
      localCart = localCart.filter((cart: Cart) => cart.productId !== productId);
      localStorage.setItem('tempCart', JSON.stringify(localCart));
      this.carts = localCart;
      console.log('Xóa sản phẩm trong giỏ hàng LocalStorage:', productId);
    }
  }
  //Xóa dữ liệu khi đóng ứng dung
  clearLocalCart(){
    localStorage.removeItem('tempCart');
  }
}
