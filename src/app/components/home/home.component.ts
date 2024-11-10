import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Slide } from '../../models/Slide';
import { AppService } from '../../service/app.service';
import { SlideService } from '../../service/slide.service';
import { Product_Price } from '../../models/Product_Price';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { ProductGetTypeName } from '../../models/ProductGetTypeName';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpServiceService } from '../../service/ip-service.service';
import { AdsModel } from '../../models/Ads';
import { environment } from '../../../environments/environment';
import { SlideAds } from '../../models/SlideAds';
import Swiper from 'swiper'; // Import Swiper here
import 'swiper/swiper-bundle.css'; // Import Swiper CSS
import { Autoplay } from 'swiper/modules';;
Swiper.use([Autoplay]);

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
  productsxedapdiahinh: ProductGetTypeName[] = [];
  productsxedapnu: ProductGetTypeName[] = [];
  products1: ProductGetTypeName[] = [];
  xedapthethaoduongpho: ProductGetTypeName[] = [];
  xedapdua: ProductGetTypeName[] = [];
  phukienchoxe: ProductGetTypeName[] = [];
  thietbitapluyengarmin: ProductGetTypeName[] = [];
  phutung: ProductGetTypeName[] = [];
  pKCNDapXe: ProductGetTypeName[] = [];
  boSuuTapXeDap: ProductGetTypeName[] = [];

  slides: Slide[] = [];
  slides2: Slide[] = [];
  slides3: Slide[] = [];
  ads: AdsModel[] = [];
  slidexetrem: SlideAds[] = [];
  slideXediahinh: SlideAds[] = [];
  slideXeNu: SlideAds[] = [];
  slideXeTtDuongPho: SlideAds[] = [];
  slideXeDua: SlideAds[] = [];
  slidePkXe:SlideAds[] = [];
  slideTBTLuyen: SlideAds[] = [];
  slidePhuTung: SlideAds[] = [];
  slidePKCNDapXe: SlideAds[] = [];

  swiperInstance: Swiper | null = null;
  swiper: Swiper | null = null;
  data: any[] = [];

  constructor(private app: AppService,
    private slideSv: SlideService,
    private cartSv: CartService,
    private router: Router,
    private decode: JwtHelperService,
    private ipSV: IpServiceService
  ) { }

  ngOnInit(): void {
    this.getProducts_Xe_dap_dia_hinh();
    this.getProduct_Xe_tre_em();
    this.getProducts_Xe_dap_nu();
    this.getProductsXedapthethaoduongpho();
    this.getProductsXedapdua();
    this.getProductsPKNDapXe();
    this.getProductsPhukienchoxe();
    this.getProductsthietbitapluyengarmin();
    this.getProductsPhutung();
    this.getSlideXeDapTreEm();
    this.getSlideXeDapDiaHinh();
    this.getSlideXeDapNu();
    this.getSlideXeTTDuongPho();
    this.getSlideXeDua();
    this.getSlidePkXe();
    this.getSlideTbTLuyen();
    this.getSlidePhuTung();
    this.getSlidePKCNDapXe();
    this.getBoSuuTapXeDap();
    this.getSlide();
    this.getSlide2();
    this.getSlide3();
    this.getAddAds();
    console.log('Đang gọi API để lấy danh sách quảng cáo...');
    this.getAddAds();
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getProducts_Xe_dap_nu(): void {
    this.app.productsXedapnu(8).subscribe(
      (res: any) => {
        this.productsxedapnu = res.data;
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

  getProducts_Xe_dap_dia_hinh(): void {
    this.app.productsXedapdiahinh(8).subscribe(
      (res: any) => {
        this.productsxedapdiahinh = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProductsXedapthethaoduongpho(): void {
    this.app.productsXedapthethaoduongpho(8).subscribe(
      (res: any) => {
        this.xedapthethaoduongpho = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProductsXedapdua(): void {
    this.app.productsXedapdua(8).subscribe(
      (res: any) => {
        this.xedapdua = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProductsPKNDapXe(): void {
    this.app.productsPKCNDapXe().subscribe(
      (res: any) => {
        this.pKCNDapXe = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProductsPhukienchoxe(): void {
    this.app.productsPhukienchoxe().subscribe(
      (res: any) => {
        this.phukienchoxe = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }
  
  getProductsthietbitapluyengarmin(): void {
    this.app.ProductsPhutung().subscribe(
      (res: any) => {
        this.thietbitapluyengarmin = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProductsPhutung(): void {
    this.app.ProductsPhutung().subscribe(
      (res: any) => {
        this.phutung = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getSlideXeDapTreEm(): void {
    this.app.SlideXeDapTreEm().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slidexetrem = Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlideXeDapDiaHinh(): void {
    this.app.SlideXeDapDiaHinh().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slideXediahinh= Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlideXeDapNu(): void {
    this.app.SlideXeDapNu().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slideXeNu= Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlideXeTTDuongPho(): void {
    this.app.SlideXeTTDuongPho().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slideXeTtDuongPho= Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlideXeDua(): void {
    this.app.SlideXeDua().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slideXeDua = Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlidePkXe(): void {
    this.app.SlidePkXe().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slidePkXe = Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlideTbTLuyen(): void {
    this.app.SlideTBTLuyen().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slideTBTLuyen = Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlidePhuTung(): void {
    this.app.SlidePhuTung().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slidePhuTung = Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getSlidePKCNDapXe(): void {
    this.app.SlidePKCNDapXe().subscribe(
      (res: any) => {
        // Wrap in an array if it's a single object
        this.slidePKCNDapXe = Array.isArray(res.data.result) ? res.data.result : [res.data.result];
        console.log("Slide data:", this.slidexetrem);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getBoSuuTapXeDap(): void {
    this.app.getBoSuuTapXeDap().subscribe(
      (res: any) => {
        this.boSuuTapXeDap = res.data;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

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
        this.slides2 = res.data;
        console.log(this.slides2);
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    });
  }

  getSlide3(): void {
    this.slideSv.getSlide3().subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        this.slides3 = res.data;
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

  ngAfterViewInit(): void {
    if (this.ads && this.ads.length > 0) {
      this.initSwiper();
    } else {
      this.getAddAds();
    }
  }

  getAddAds(): void {
    this.slideSv.getAllAds().subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        this.ads = res.data.map((ad: AdsModel) => {
          ad.imageUrl = `${environment.apiUrl}${ad.image}`;
          return ad;
        });
        if (this.ads.length > 0) {
          this.initSwiper();
        } else {
          console.error('Không có quảng cáo để hiển thị');
        }
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    }, (error) => {
      console.error('Lỗi khi gọi API:', error);
    });
  }

  private initSwiper(): void {
    console.log('Khởi tạo Swiper với dữ liệu mới...');
  
    const swiperConfig = {
      loop: this.ads.length > 1,
      slidesPerView: 1,
      spaceBetween: 1,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        clickable: true,
        el: '.swiper-pagination', // Đảm bảo rằng phần tử này tồn tại trong HTML
        type: 'bullets' as 'bullets',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        waitForTransition: false,
      },
      on: {
        init: () => {
          console.log('Swiper đã được khởi tạo');
          this.startAutoplay();
        }
      }
    };
  
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  
    this.swiper = new Swiper('.swiper-container', swiperConfig);
    this.startAutoplay();
  }

  private startAutoplay(): void {
    if (this.swiper && this.swiper.autoplay) {
      this.swiper.autoplay.start();
      console.log('Autoplay đã được bật');
    } else {
      console.error('Lỗi: autoplay không tồn tại');
    }
  }
}

