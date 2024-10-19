import { Component, OnInit } from '@angular/core';
import { AccessoryService } from '../../service/accessory.service';
import { CartService } from '../../service/cart.service';
import { ProductType } from '../../models/ProductType';
import { ProductResponseType } from '../../models/ProductType';
import { Router } from '@angular/router';

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

  constructor(private accessoryService: AccessoryService, private cartSv: CartService, private router: Router) { }

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
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!this.cartSv.isLoggedIn()) {
      const userConfirmed = confirm('You are not logged in. Would you like to log in to add products to the cart?');

      if (userConfirmed) {
        this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
        return; // Dừng thực hiện hàm nếu người dùng xác nhận đăng nhập
      } else {
        // Lấy dữ liệu giỏ hàng hiện tại từ localStorage
        let tempCart: any[] = JSON.parse(localStorage.getItem('tempCart') || '[]');

        producPrice.forEach(product => {
          const productId = product.id; // Lấy productId
          const productName = product.productName; // Lấy tên sản phẩm
          const priceProduct = product.priceHasDecreased || product.price; // Kiểm tra giá đã giảm
          const quantity = 1; // Số lượng mặc định là 1

          // Kiểm tra xem sản phẩm đã có trong giỏ hàng tạm thời chưa
          const existingProduct = tempCart.find(item => item.productId === productId);

          if (existingProduct) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            existingProduct.quantity += quantity;
          } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            tempCart.push({ productId, productName, priceProduct, quantity });
          }
        });

        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('tempCart', JSON.stringify(tempCart));
        alert('Products added to temporary cart.');
      }
    } else {
      // Người dùng đã đăng nhập, thêm sản phẩm vào giỏ hàng trên server
      const productIds: number[] = producPrice.map(product => product.id); // Lấy danh sách ID sản phẩm

      // Gọi API tạo giỏ hàng
      this.cartSv.createCart(productIds).subscribe(
        (response: any) => {
          alert('Add to cart successfully');
        },
        (error: any) => {
          // Log chi tiết lỗi để kiểm tra
          console.error('Error response:', error);
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
