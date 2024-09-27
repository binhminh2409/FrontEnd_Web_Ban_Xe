import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { Product_Price } from '../../models/Product_Price';
import { ProductResponse } from '../../models/Product_Price';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  producPrice: Product_Price[] = []; // Biến để lưu trữ giá sản phẩm
  isDataAvailable: boolean = true; // Biến trạng thái kiểm tra dữ liệu
  selectedBrands: string[] = [];

  itemsPerPage = 9;
  currentPage = 1;

  constructor(private productService: ProductsService, private cartSv: CartService) { }

  ngOnInit(): void {
    // Gọi hàm getAllPrices với giá trị min và max mặc định
    this.getAllPrices(0, 50000000);
    // Mặc định chọn ô "All brands"
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
    const HostUrl = "https://localhost:7066/api";
    return data && data.id ? `${HostUrl}/Products/images/product/${data.id}` : '';
  }

  onAddToCart(producPrice: Product_Price[]) {
    const productIds: number[] = producPrice.map(product => product.id);
    if (!this.cartSv.isLoggedIn()) {
      alert('Please login to add products to cart.');
      return;
    }

    this.cartSv.createCart(productIds).subscribe(
      (response: any) => {
        alert('Add to cart successfully');
      },
      (error: any) => {
        alert(error.error?.message || 'Add to cart failed');
      }
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (target.checked) {
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox as HTMLInputElement;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      });
    }

    let minPrice = 0;
    let maxPrice = 0;

    switch (target.id) {
      case 'price-1':
        minPrice = 0;
        maxPrice = 5000000;
        break;
      case 'price-2':
        minPrice = 5000000;
        maxPrice = 10000000;
        break;
      case 'price-3':
        minPrice = 10000000;
        maxPrice = 20000000;
        break;
      case 'price-4':
        minPrice = 20000000;
        maxPrice = 30000000;
        break;
      case 'price-5':
        minPrice = 30000000;
        maxPrice = 40000000;
        break;
      case 'price-all':
        minPrice = 0;
        maxPrice = 50000000;
        break;
      default:
        return;
    }
    this.getAllPrices(minPrice, maxPrice);
  }

  getAllPrices(minPrice: number, maxPrice: number) {
    console.log('Fetching prices between:', minPrice, maxPrice);
    this.productService.getListPrice(minPrice, maxPrice).subscribe(
      (response: ProductResponse) => {
        console.log('Response received:', response);
        this.producPrice = response.data;
        this.isDataAvailable = true;  // Đánh dấu là dữ liệu đã có
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (target.checked) {
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox as HTMLInputElement;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      });
    }

    let BrandName = "";

    switch (target.id) {
      case 'color-1':
        BrandName = "Trek";
        break;
      case 'color-2':
        BrandName = "Giant";
        break;
      case 'color-3':
        BrandName = "Specialized";
        break;
      case 'color-4':
        BrandName = "Cannondale";
        break;
      case 'color-5':
        BrandName = "Scott";
        break;
      case 'color-6':
        BrandName = "Bianchi";
        break;
      case 'color-7':
        BrandName = "Merida";
        break;
      case 'color-8':
        BrandName = "Salsa Cycles";
        break;
      case 'color-all':
        BrandName = "";
        break;
      default:
        return;
    }

    console.log(BrandName);
  }
}
