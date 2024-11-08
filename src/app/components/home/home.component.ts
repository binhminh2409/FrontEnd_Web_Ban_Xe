import { Component, OnInit } from '@angular/core';
import { Slide } from '../../models/Slide';
import { AppService } from '../../service/app.service';
import { SlideService } from '../../service/slide.service';
import { Product_Price } from '../../models/Product_Price';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { ProductGetTypeName } from '../../models/ProductGetTypeName';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpServiceService } from '../../service/ip-service.service';

// Định nghĩa giao diện cho đối tượng sản phẩm
interface Product {
  id: number;
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
  products: ProductGetTypeName[] = [];
  products1: ProductGetTypeName[] = [];
  slides: Slide[] = [];
  slides2: Slide[] = [];
  slides3: Slide[] = [];

  constructor(private app: AppService,
    private slideSv: SlideService,
    private cartSv: CartService,
    private router: Router,
    private decode: JwtHelperService,
    private ipSV: IpServiceService
  ) { }

  ngOnInit(): void {
    this.getProducts_Xe_moi_ve();
    this.getProduct_Xe_tre_em();
    this.getSlide();
    this.getSlide2();
    this.getSlide3();
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
    const HostUrl = "https://localhost:5001/api";
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
        console.log(this.slides)
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    });
  }

  getSlide2(): void {
    this.slideSv.getSlide2().subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        this.slides2 = res.data;  // Gán dữ liệu cho slides2
        console.log(this.slides2);
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    });
  }

  getSlide3(): void {
    this.slideSv.getSlide3().subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        this.slides3 = res.data;  // Gán dữ liệu cho slides3
        console.log(this.slides3);
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    });
  }



  //getImage slide 
  getImageUrlSile(data: Slides): string {
    const HostUrl = "https://localhost:5001/api";
    if (data && data.id) {
      return `${HostUrl}/Slide/images/slide/${data.id}`;
    } else {
      return '';
    }
  }

  getImageUrlSile4(slide2: Slide): string {
    const HostUrl = "https://localhost:5001/api";
    const slideId = slide2.id;
    return `${HostUrl}/Slide/images/slide/${slideId}`;
  }

  getImageUrlSile5(slide3: Slide): string {
    const HostUrl = "https://localhost:5001/api";
    const slideId = slide3.id;
    return `${HostUrl}/Slide/images/slide/${slideId}`;
  }

  onAddToCart(producPrice: Product_Price[]) {
    const productIds: number[] = producPrice.map(product => product.id);
    let guiId: string | null = null;

    if (!this.cartSv.isLoggedIn()) {
      const userConfirmed = confirm('You are not logged in. Do you want to log in to save your items forever?');

      if (userConfirmed) {
        this.router.navigate(['/login']);
        return;
      } else {
        this.ipSV.getIpAddress().subscribe(
          (response: { ip: string }) => {
            guiId = response.ip;
            this.cartSv.createCart(productIds, guiId).subscribe(
              (response: any) => {
                alert('Add to cart successfully');
              },
              (error: any) => {
                console.error('Lỗi:', error);
                alert(error.error?.message || 'Add to cart failed');
              }
            );
          },
          (error) => {
            alert('Không thể lấy địa chỉ IP. Vui lòng thử lại.');
          }
        );
      }
    } else {
      const token = localStorage.getItem('token');
      let userId: number | null = null;
      if (token) {
        const decodedToken = this.decode.decodeToken(token);
        userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          ? parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
          : null;
      }
      if (!userId) {
        alert('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      this.cartSv.createCart(productIds, guiId).subscribe(
        (response: any) => {
          alert('Add to cart successfully');
        },
        (error: any) => {
          console.error('Lỗi:', error);
          alert(error.error?.message || 'Add to cart failed');
        }
      );
    }
  }

  onAddToCartslides(slides: Slide[]): void {
    if (slides.length === 0) {
      alert('Không có sản phẩm nào để thêm vào giỏ hàng.');
      return;
    }
    const productPrices: Product_Price[] = this.convertSlidesToProductPrices(slides);
    const productIds: number[] = productPrices.map(product => product.id);
    let guiId: string | null = null;
    if (!this.cartSv.isLoggedIn()) {
      console.log('Người dùng chưa đăng nhập.');
      const userConfirmed = confirm('You are not logged in. Do you want to log in to save your items forever?');
      if (userConfirmed) {
        this.router.navigate(['/login']);
        return;
      } else {
        this.ipSV.getIpAddress().subscribe(
          (response: { ip: string }) => {
            guiId = response.ip;
            this.createCart(productIds, guiId, slides);
          },
          (error) => {
            alert('Không thể lấy địa chỉ IP. Vui lòng thử lại.');
            console.error('Lỗi khi lấy địa chỉ IP:', error);
          }
        );
      }
    } else {
      const token = localStorage.getItem('token');
      let userId: number | null = null;
      if (token) {
        const decodedToken = this.decode.decodeToken(token);
        userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          ? parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
          : null;
      }
      if (!userId) {
        alert('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      this.createCart(productIds, userId.toString(), slides);
    }
  }

  private createCart(productIds: number[], id: string | null, slides: Slide[]): void {
    const productPrices = this.convertSlidesToProductPrices(slides);
    productIds = productPrices.map(productPrice => productPrice.id);

    this.cartSv.createCartslide(productIds, id).subscribe(
      (response: any) => {
        if (response.success) {
          alert('Add to cart successfully');
          setTimeout(() => {
            this.router.navigate(['/checkout']);
          }, 0);
        } else {
          alert(response.message || 'Add to cart failed');
        }
      },
      (error: any) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        alert(error.error?.message || 'Add to cart failed');
      }
    );
  }

  private convertSlidesToProductPrices(slides: Slide[]): Product_Price[] {
    return slides.map(slide => ({
      id: slide.id,
      productName: slide.name,
      price: slide.PriceHasDecreased ? 0 : slide.PriceHasDecreased,
      priceHasDecreased: slide.PriceHasDecreased,
      image: slide.image,
      brandNamer: "Some Brand"
    }));
  }
}
