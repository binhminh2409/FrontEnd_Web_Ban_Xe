import { Component, OnInit } from '@angular/core';
import { AccessoryService } from '../../service/accessory.service';
import { CartService } from '../../service/cart.service';
import { ProductType } from '../../models/ProductType';
import { ProductResponseType } from '../../models/ProductType';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpServiceService } from '../../service/ip-service.service';

@Component({
  selector: 'app-accessory',
  templateUrl: './accessory.component.html',
  styleUrls: ['./accessory.component.scss']
})
export class AccessoryComponent {
  producType: ProductType[] = []; // Biến để lưu trữ giá sản phẩm
  isDataAvailable: boolean = true; // Biến trạng thái kiểm tra dữ liệu
  selectedBrands: string[] = [];

  // Biến lưu trữ giá trị hiện tại
  currentMinPrice: number = 0;
  currentMaxPrice: number = 50000000;
  selectedBrand: string = "";
  keyword: string = "";

  itemsPerPage = 9;
  currentPage = 1;

  constructor(private accessoryService: AccessoryService,
    private cartSv: CartService,
    private router: Router,
    private decode: JwtHelperService,
    private ipSV: IpServiceService
  ) { }

  ngOnInit(): void {
    this.selectAllBrands();
    this.getProductTypes();
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

  getImageUrl(data: ProductType): string {
    const HostUrl = "https://localhost:5001/api";
    return data && data.id ? `${HostUrl}/Products/images/product/${data.id}` : '';
  }

  onAddToCart(producPrice: ProductType[]) {
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

  getPages(): number[] {
    const totalPages = Math.ceil(this.producType.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.producType.length / this.itemsPerPage);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getProductTypes(): void {
    this.accessoryService.getProductType().subscribe({
      next: (response: ProductResponseType) => {
        if (response.success) {
          this.producType = response.data;
          console.log('Dữ liệu sản phẩm trả về:', this.producType);
        } else {
          console.error('Không có dữ liệu sản phẩm', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching product types', err);
      }
    });
  }

  getProducts(keyword: string) {
    if (!keyword) {
      console.log('Keyword is missing, unable to fetch products.');
      this.isDataAvailable = false;
      return;
    }

    this.accessoryService.getProductName(keyword).subscribe(
      (response: ProductResponseType) => {
        console.log('Response received:', response);
        this.producType = response.data;
        this.isDataAvailable = true;
        if (this.producType && this.producType.length > 0) {
          this.producType.forEach(product => {
            console.log(`Product Name: ${product.productName}`);
          });
        } else {
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let isChecked = false;

    checkboxes.forEach((checkbox) => {
      const inputCheckbox = checkbox as HTMLInputElement;
      if (inputCheckbox.checked) {
        isChecked = true;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      }
    });
    if (isChecked) {
      switch (target.id) {
        case 'filter-shirt':
          this.selectedBrand = "Áo";
          break;
        case 'filter-shoe':
          this.selectedBrand = "Giày";
          break;
        case 'filter-hat':
          this.selectedBrand = "Mũ";
          break;
        case 'filter-bag':
          this.selectedBrand = "Túi";
          break;
        case 'filter-accessory':
          this.selectedBrand = "Phụ kiện";
          break;
        default:
          console.log('Không có thương hiệu nào được chọn.');
          return;
      }
      console.log('Selected Brand:', this.selectedBrand);
      this.getProducts(this.selectedBrand);
    } else {
      console.log('Không có thương hiệu nào được chọn. Lấy tất cả sản phẩm.');
      this.getProductTypes();
    }
  }
}
