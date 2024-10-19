import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { Product_Price } from '../../models/Product_Price';
import { ProductResponse } from '../../models/Product_Price';
import { Router } from '@angular/router';

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

  itemsPerPage = 9;
  currentPage = 1;

  constructor(private productService: ProductsService, private cartSv: CartService, private router: Router) { }

  ngOnInit(): void {
    this.getAllPrices(this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
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
    if (!this.cartSv.isLoggedIn()) {
      const userConfirmed = confirm('You are not logged in. Would you like to log in to add products to the cart?');
  
      if (userConfirmed) {
        this.router.navigate(['/login']);
        return;
      } else {
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
    this.getAllPrices(this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
  }

  getAllPrices(minPrice: number, maxPrice: number, brandName: string) {
    const apiUrl = `https://localhost:5001/api/Products/GetProductsWithinPriceRangeAndBrand?minPrice=${minPrice}&maxPrice=${maxPrice}&brandsName=${brandName}`;
    console.log('Fetching prices between:', minPrice, maxPrice, 'for brand:', brandName);

    this.productService.getListPrice(minPrice, maxPrice, brandName).subscribe(
      (response: ProductResponse) => {
        console.log('Response received:', response);
        this.producPrice = response.data;
        this.isDataAvailable = true;

        // Kiểm tra giá trị priceHasDecreased
        this.producPrice.forEach(product => {
          console.log(`Product Name: ${product.productName}, Price: ${product.price}, Price Has Decreased: ${product.priceHasDecreased}`);
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
        this.selectedBrand = "Trek";
        break;
      case 'color-2':
        this.selectedBrand = "Giant";
        break;
      case 'color-3':
        this.selectedBrand = "Specialized";
        break;
      case 'color-4':
        this.selectedBrand = "Cannondale";
        break;
      case 'color-5':
        this.selectedBrand = "Scott";
        break;
      case 'color-6':
        this.selectedBrand = "Bianchi";
        break;
      case 'color-7':
        this.selectedBrand = "Merida";
        break;
      case 'color-8':
        this.selectedBrand = "Salsa Cycles";
        break;
      case 'color-all':
        this.selectedBrand = "";
        break;
      default:
        return;
    }

    // Gọi lại hàm lọc với giá trị mức giá hiện tại
    this.getAllPrices(this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
  }
}
