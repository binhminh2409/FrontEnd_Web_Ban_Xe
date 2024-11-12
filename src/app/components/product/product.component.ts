import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { Product_Price } from '../../models/Product_Price';
import { ProductResponse } from '../../models/Product_Price';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpServiceService } from '../../service/ip-service.service';

import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  producPrice: Product_Price[] = [];
  isDataAvailable: boolean = true;
  selectedBrands: string[] = [];

  currentMinPrice: number = 0;
  currentMaxPrice: number = 50000000;
  selectedBrand: string = "";
  productType = "Xe trẻ em"

  itemsPerPage = 9;
  currentPage = 1;

  constructor(private productService: ProductsService,
    private cartSv: CartService,
    private router: Router,
    private decode: JwtHelperService,
    private ipSV: IpServiceService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getAllPrices(this.productType, this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
    this.selectAllBrands();
  }

  selectAllBrands() {
    const allBrandsCheckbox = document.getElementById('color-all') as HTMLInputElement;
    if (allBrandsCheckbox) {
      allBrandsCheckbox.checked = true;
    }
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getImageUrl(data: Product_Price): string {
    const HostUrl = "https://localhost:5001/api";
    return data && data.id ? `${HostUrl}/Products/images/product/${data.id}` : '';
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
                // Success notification
                console.log(response)
                this.createNotification('top','Success', 'Items added to cart successfully!');
              },
              (error: any) => {
                // Error notification
                console.error('Lỗi:', error);
                this.notification.error(
                  'Error',
                  error.error?.message || 'Add to cart failed',
                  { nzPlacement: 'topRight' }
                );
              }
            );
          },
          (error) => {
            // Error notification for IP fetch failure
            this.notification.error(
              'Error',
              'Không thể lấy địa chỉ IP. Vui lòng thử lại.',
              { nzPlacement: 'topRight' }
            );
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
        // Error notification for missing user ID
        this.notification.error(
          'Error',
          'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.',
          { nzPlacement: 'topRight' }
        );
        return;
      }
      this.cartSv.createCart(productIds, guiId).subscribe(
        (response: any) => {
          // Success notification
          this.notification.success(
            'Success',
            'Items added to cart successfully!',
            { nzPlacement: 'topRight' }
          );
        },
        (error: any) => {
          // Error notification
          console.error('Lỗi:', error);
          this.notification.error(
            'Error',
            error.error?.message || 'Add to cart failed',
            { nzPlacement: 'topRight' }
          );
        }
      );
    }
  }

  createNotification(position: NzNotificationPlacement, tile: string, description: string): void {
    this.notification.blank(
      tile,
      description,
      { nzPlacement: position }
    );
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.producPrice.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.producPrice.length / this.itemsPerPage);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const checkboxes = (event.currentTarget as HTMLFormElement).querySelectorAll('input[type="checkbox"]');

    if (target.checked) {
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox as HTMLInputElement;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      });
    }

    switch (target.id) {
      case 'price-1':
        this.currentMinPrice = 0;
        this.currentMaxPrice = 5000000;
        break;
      case 'price-2':
        this.currentMinPrice = 5000000;
        this.currentMaxPrice = 10000000;
        break;
      case 'price-3':
        this.currentMinPrice = 10000000;
        this.currentMaxPrice = 20000000;
        break;
      case 'price-4':
        this.currentMinPrice = 20000000;
        this.currentMaxPrice = 30000000;
        break;
      case 'price-5':
        this.currentMinPrice = 30000000;
        this.currentMaxPrice = 40000000;
        break;
      case 'price-all':
        this.currentMinPrice = 0;
        this.currentMaxPrice = 50000000;
        break;
      default:
        return;
    }

    // Gọi lại hàm lọc với giá trị thương hiệu hiện tại
    this.getAllPrices(this.productType, this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
  }

  getAllPrices(productType: string, minPrice: number, maxPrice: number, brandName: string) {
    const apiUrl = `https://localhost:5001/api/Products/GetProductsWithinPriceRangeAndBrand?productType=${productType}minPrice=${minPrice}&maxPrice=${maxPrice}&brandsName=${brandName}`;
    console.log('Fetching prices between:', minPrice, maxPrice, 'for brand:', brandName);

    this.productService.getListPrice(productType, minPrice, maxPrice, brandName).subscribe(
      (response: ProductResponse) => {
        this.producPrice = response.data;
        this.isDataAvailable = true;

        // Kiểm tra giá trị priceHasDecreased
        this.producPrice.forEach(product => {
        });

        if (this.producPrice.length === 0) {
          console.log('Không có sản phẩm');
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isDataAvailable = false;
      }
    );
  }

  onCheckboxChangeBrand(event: Event) {
    const target = event.target as HTMLInputElement;
    const checkboxes = (event.currentTarget as HTMLFormElement).querySelectorAll('input[type="checkbox"]');

    if (target.checked) {
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox as HTMLInputElement;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      });
    }

    switch (target.id) {
      case 'color-1':
        this.selectedBrand = "TrinX";
        break;
      case 'color-2':
        this.selectedBrand = "Stitch";
        break;
      case 'color-3':
        this.selectedBrand = "Liv";
        break;
      case 'color-4':
        this.selectedBrand = "Vinbike";
        break;
      case 'color-5':
        this.selectedBrand = "Royalbaby";
        break;
      case 'color-6':
        this.selectedBrand = "MAX BIKE";
        break;
      case 'color-7':
        this.selectedBrand = "Misaki";
        break;
      case 'color-8':
        this.selectedBrand = "YBQ";
        break;
      case 'color-9':
        this.selectedBrand = "Fornix";
        break;
      case 'color-all':
        this.selectedBrand = "";
        break;
      default:
        return;
    }

    // Gọi lại hàm lọc với giá trị mức giá hiện tại
    this.getAllPrices(this.productType, this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
  }
}
