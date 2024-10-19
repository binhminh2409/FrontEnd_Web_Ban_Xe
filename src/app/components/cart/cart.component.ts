import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { JsonpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];

  constructor(private cartSv: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCartData();
  }

  getFormattedPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')} đ`;
  }

  loadCartData(): void {
    const userId = this.cartSv.checkLogin();
    if (userId) {
      this.cartSv.getCart().subscribe({
        next: (res: any) => {
          if (res && res.data && Array.isArray(res.data)) {
            this.carts = res.data;
          } else {
            console.error("Invalid data format:", res);
          }
        },
        error: (err) => {
          console.error('Error fetching cart data:', err);
        }
      });
    } else {
      const localCart = localStorage.getItem('tempCart');
      if (localCart) {
        try {
          this.carts = JSON.parse(localCart);
          this.carts.forEach((item: Cart) => {
            item.totalPrice = item.priceProduct * item.quantity;
            const imageUrl = this.getImageUrl(item);
            console.log('Image URL for product:', item.productId, 'is', imageUrl);
          });
        } catch (error) {
          console.error('Error parsing LocalStorage cart:', error);
        }
      } else {
        console.log('Không có giỏ hàng trong LocalStorage');
      }
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

    if (userId) {
      if (cartItem.productId) {
        this.cartSv.updateQuantity(cartItem.productId, userId, 'increase').subscribe(() => {
          this.loadCartData();
        }, error => {
          console.error("Lỗi khi tăng số lượng sản phẩm:", error);
        });
      } else {
        console.error("productId không được xác định cho cartItem:", cartItem);
      }
    } else {
      cartItem.quantity += 1;
      cartItem.totalPrice = cartItem.priceProduct * cartItem.quantity;
      const localCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
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
      this.cartSv.updateQuantity(cartItem.productId, userId, 'decrease').subscribe(() => {
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
  clearLocalCart() {
    localStorage.removeItem('tempCart');
  }

  proceedToCheckout() {
    const isLoggedIn = this.cartSv.isLoggedIn();
  
    if (!isLoggedIn) {
      let CartCheckout: any[] = JSON.parse(sessionStorage.getItem('CartCheckout') || '[]');
      
      this.carts.forEach(cart => {
        const productId = cart.productId;
        const productName = cart.productName;
        const priceProduct = cart.priceProduct;
        const quantity = cart.quantity;
        const image = cart.image;
        const totalPrice = cart.totalPrice;
        const cartId = this.generateRandomCartId();
  
        CartCheckout.push({ productId, productName, priceProduct, quantity, image, totalPrice, cartId });
      });
  
      sessionStorage.setItem('CartCheckout', JSON.stringify(CartCheckout));
      alert('Products added to temporary cart.');
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }
  
  private generateRandomCartId(): number {
    return Math.floor(Math.random() * 1000000);
  }
} 
