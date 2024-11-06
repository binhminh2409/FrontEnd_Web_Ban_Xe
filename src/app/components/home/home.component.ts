import { Component, OnInit } from '@angular/core';
import { Slide } from '../../models/Slide';
import { AppService } from '../../service/app.service';
import { SlideService } from '../../service/slide.service';
import { Product_Price } from '../../models/Product_Price';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { ProductGetTypeName, ApiResponse } from '../../models/ProductGetTypeName';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpServiceService } from '../../service/ip-service.service';
import { sample } from 'rxjs';

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
  bestSellingProducts: ProductGetTypeName[] = [];
  hasProducts: boolean = false;

  constructor(private app: AppService,
    private slideSv: SlideService,
    private cartSv: CartService,
    private router: Router,
    private decode: JwtHelperService,
    private ipSV: IpServiceService
  ) { }
  ngOnInit(): void {
    // this.getProducts_Xe_moi_ve();
    // this.getProduct_Xe_tre_em();
    // this.getSlide();
    // this.getSlide2();
    // this.getSlide3();
    // this.getBestSellingProducts();
    this.getSample();
  }

  // **********************
  // Sample data
  private getSample(): ProductGetTypeName[] {
    var sample = [
      {
        id: 1,
        productName: 'Mountain Bike',
        price: 500,
        priceHasDecreased: 450,
        description: 'A sturdy mountain bike for rugged terrains.',
        image: 'mountain-bike.jpg',
        typeName: 'Bike',
        brandNamer: 'MountainCo'
      },
      {
        id: 2,
        productName: 'Road Bike',
        price: 600,
        priceHasDecreased: 550,
        description: 'A lightweight road bike designed for speed.',
        image: 'road-bike.jpg',
        typeName: 'Bike',
        brandNamer: 'SpeedTech'
      },
      {
        id: 3,
        productName: 'Hybrid Bike',
        price: 450,
        priceHasDecreased: 420,
        description: 'A hybrid bike for both road and trail riding.',
        image: 'hybrid-bike.jpg',
        typeName: 'Bike',
        brandNamer: 'UrbanCycling'
      },
      {
        id: 4,
        productName: 'Electric Bike',
        price: 1000,
        priceHasDecreased: 950,
        description: 'A comfortable electric bike with pedal assist.',
        image: 'electric-bike.jpg',
        typeName: 'Bike',
        brandNamer: 'VoltCycles'
      },
      {
        id: 5,
        productName: 'Sports Helmet',
        price: 50,
        priceHasDecreased: 40,
        description: 'A high-performance helmet for biking safety.',
        image: 'sports-helmet.jpg',
        typeName: 'Accessories',
        brandNamer: 'SafeRider'
      },
      {
        id: 6,
        productName: 'Water Bottle Holder',
        price: 15,
        priceHasDecreased: 10,
        description: 'A durable water bottle holder for your bike.',
        image: 'water-bottle-holder.jpg',
        typeName: 'Accessories',
        brandNamer: 'HydroGear'
      },
      {
        id: 7,
        productName: 'Bike Lock',
        price: 25,
        priceHasDecreased: 20,
        description: 'A heavy-duty bike lock for security.',
        image: 'bike-lock.jpg',
        typeName: 'Accessories',
        brandNamer: 'LockSafe'
      },
      {
        id: 8,
        productName: 'Cycling Shoes',
        price: 120,
        priceHasDecreased: 100,
        description: 'Specialized shoes designed for cycling performance.',
        image: 'cycling-shoes.jpg',
        typeName: 'Clothing',
        brandNamer: 'SpeedStep'
      },
      {
        id: 9,
        productName: 'Cycling Gloves',
        price: 30,
        priceHasDecreased: 25,
        description: 'Comfortable gloves for long rides.',
        image: 'cycling-gloves.jpg',
        typeName: 'Clothing',
        brandNamer: 'GripPro'
      },
      {
        id: 10,
        productName: 'Cycling Shorts',
        price: 80,
        priceHasDecreased: 70,
        description: 'Breathable shorts designed for cycling.',
        image: 'cycling-shorts.jpg',
        typeName: 'Clothing',
        brandNamer: 'PedalFit'
      },
      {
        id: 11,
        productName: 'LED Bike Lights',
        price: 40,
        priceHasDecreased: 35,
        description: 'Bright LED lights for biking at night.',
        image: 'led-bike-lights.jpg',
        typeName: 'Accessories',
        brandNamer: 'NightRide'
      },
      {
        id: 12,
        productName: 'Bike Saddle',
        price: 60,
        priceHasDecreased: 55,
        description: 'Comfortable saddle for long-distance rides.',
        image: 'bike-saddle.jpg',
        typeName: 'Accessories',
        brandNamer: 'ComfortCycle'
      },
      {
        id: 13,
        productName: 'Mountain Bike Shoes',
        price: 90,
        priceHasDecreased: 80,
        description: 'Specialized shoes for mountain biking.',
        image: 'mountain-bike-shoes.jpg',
        typeName: 'Clothing',
        brandNamer: 'GripX'
      },
      {
        id: 14,
        productName: 'Cycling Socks',
        price: 15,
        priceHasDecreased: 12,
        description: 'Breathable socks designed for cycling.',
        image: 'cycling-socks.jpg',
        typeName: 'Clothing',
        brandNamer: 'FitGear'
      },
      {
        id: 15,
        productName: 'Bike Repair Kit',
        price: 30,
        priceHasDecreased: 25,
        description: 'A complete repair kit for your bike.',
        image: 'bike-repair-kit.jpg',
        typeName: 'Accessories',
        brandNamer: 'FixItPro'
      },
      {
        id: 16,
        productName: 'Bike Bell',
        price: 10,
        priceHasDecreased: 8,
        description: 'A loud, clear bike bell for safety.',
        image: 'bike-bell.jpg',
        typeName: 'Accessories',
        brandNamer: 'RingSafe'
      },
      {
        id: 17,
        productName: 'Bike Water Bottle',
        price: 20,
        priceHasDecreased: 15,
        description: 'Durable water bottle for hydration.',
        image: 'bike-water-bottle.jpg',
        typeName: 'Accessories',
        brandNamer: 'HydrationPlus'
      },
      {
        id: 18,
        productName: 'Bike Pump',
        price: 35,
        priceHasDecreased: 30,
        description: 'A portable pump for your bike tires.',
        image: 'bike-pump.jpg',
        typeName: 'Accessories',
        brandNamer: 'QuickFill'
      },
      {
        id: 19,
        productName: 'Bike Chain',
        price: 25,
        priceHasDecreased: 20,
        description: 'Durable chain for your bike.',
        image: 'bike-chain.jpg',
        typeName: 'Accessories',
        brandNamer: 'ChainMaster'
      },
      {
        id: 20,
        productName: 'Bike Reflectors',
        price: 15,
        priceHasDecreased: 10,
        description: 'Reflectors for safety during night rides.',
        image: 'bike-reflectors.jpg',
        typeName: 'Accessories',
        brandNamer: 'SafeRide'
      }
    ];
    this.products = sample;
    this.products1 = sample;
    this.bestSellingProducts = sample;
    this.hasProducts = true;

    return sample;

  }

  getImageUrl(data: Product): string {
    return "https://www.rollbicycles.com/cdn/shop/products/A1_SIDE_BRG_BLK_2880x1600_0b1024fe-3bd8-4d95-8d63-8331bba972f7.png?v=1594754081"
  }

  // Phương thức để lấy URL hình ảnh dựa trên id của sản phẩm
  // getImageUrl(data: Product): string {
  //   const HostUrl = "https://localhost:5001/api";
  //   console.log(`${HostUrl}/Products/images/product/${data.id}`);
  //   if (data && data.id) {
  //     return `${HostUrl}/Products/images/product/${data.id}`;
  //   } else {
  //     return '';
  //   }
  // }

  // *******************************

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getBestSellingProducts(): void {
    this.app.ListOfBestSellingProducts().subscribe({
      next: (response: ApiResponse<ProductGetTypeName>) => {
        if (response.success && response.data && response.data.result && response.data.result.length > 0) {
          this.bestSellingProducts = response.data.result;
          console.log(`best: ${this.bestSellingProducts}`)
          this.hasProducts = true; // Có sản phẩm, hiển thị form
        } else {
          console.error('Dữ liệu không hợp lệ:', response);
          this.hasProducts = false; // Không có sản phẩm, ẩn form
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy sản phẩm bán chạy:', err);
        alert('Không thể tải danh sách sản phẩm bán chạy.');
        this.hasProducts = false; // Không có sản phẩm, ẩn form
      }
    });
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
