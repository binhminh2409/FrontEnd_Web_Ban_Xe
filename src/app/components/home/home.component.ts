import { Component, OnInit } from '@angular/core';
import { Slide } from '../../models/Slide';
import { AppService } from '../../service/app.service';
import { SlideService } from '../../service/slide.service';
import { Product_Price } from '../../models/Product_Price';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';

// Định nghĩa giao diện cho đối tượng sản phẩm
interface Product {
  id: string;
}
interface Slides {
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any;
  products1: any;
  slides: Slide[] = [];

  constructor(private app: AppService, private slideSv: SlideService, private cartSv: CartService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts_Xe_moi_ve();
    this.getProduct_Xe_tre_em();
    this.getSlide();
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getProducts_Xe_moi_ve(): void {
    this.app.productsXemoive(8).subscribe(
      (res: any) => {
        this.products = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProduct_Xe_tre_em(): void {
    this.app.productsXetreem(8).subscribe(
      (res: any) => {
        this.products1 = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  // Phương thức để lấy URL hình ảnh dựa trên id của sản phẩm
  getImageUrl(data: Product): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.id) {
      return `${HostUrl}/Products/images/product/${data.id}`;
    } else {
      return '';
    }
  }

  getSlide(): void {
    this.slideSv.getSlide().subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        this.slides = res.data;
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    });
  }

  //getImage slide 
  getImageUrlSile(data: Slides): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.id) {
      return `${HostUrl}/Slide/images/slide/${data.id}`;
    } else {
      return '';
    }
  }
  getImageUrlSile4() {
    const HostUrl = "https://localhost:7066/api"
    const slideId = 2
    return `${HostUrl}/Slide/images/slide/2`
  }
  getImageUrlSile5() {
    const HostUrl = "https://localhost:7066/api"
    const slideId = 3
    return `${HostUrl}/Slide/images/slide/3`
  }

  onAddToCart(producPrice: Product_Price[]) {
    if (!this.cartSv.isLoggedIn()) {
      const userConfirmed = confirm('You are not logged in. Would you like to log in to add products to the cart?');
      if (userConfirmed) {
        this.router.navigate(['/login']);
        return;
      } else {
        alert('You can still add products to the cart, but they will not be saved for later.');
        let tempCart: any[] = JSON.parse(localStorage.getItem('tempCart') || '[]');
        producPrice.forEach(product => {
          const productId = product.id;
          const productName = product.productName;
          const priceProduct = product.priceHasDecreased || product.price;
          const quantity = 1;
          const existingProduct = tempCart.find(item => item.productId === productId);

          if (existingProduct) {
            existingProduct.quantity += quantity;
          } else {
            tempCart.push({ productId, productName, priceProduct, quantity });
          }
        });
        localStorage.setItem('tempCart', JSON.stringify(tempCart));
        alert('Products added to temporary cart.');
      }
    } else {
      const productIds: number[] = producPrice.map(product => product.id);
      this.cartSv.createCart(productIds).subscribe(
        (response: any) => {
          alert('Add to cart successfully');
        },
        (error: any) => {
          console.error('Error response:', error);
          alert(error.error?.message || 'Add to cart failed');
        }
      );
    }
  }
}
