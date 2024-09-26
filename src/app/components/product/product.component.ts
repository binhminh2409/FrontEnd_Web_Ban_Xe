import { Component, OnInit } from '@angular/core';
import { Products } from '../../models/Produts';
import { ProductsService } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { PriceRangePipe } from '../product-filter.pipe.ts/product-filter.pipe.ts.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products1: Products[] = [];

  itemsPerPage = 6;
  currentPage = 1;

  constructor(private productService: ProductsService, private cartSv: CartService, private priceRangePipe: PriceRangePipe ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res: any) => {
      if (res && res.data && Array.isArray(res.data)) {
        this.products1 = res.data;

        console.log(this.products1);
      } else {
        console.error("Invalid data format:", res);
      }
    });
  }
  // Phương thức để lấy URL hình ảnh dựa trên id của sản phẩm
  getImageUrl(data: Products): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.id) {
      return `${HostUrl}/Products/images/product/${data.id}`;
    } else {
      return ''; // hoặc bạn có thể trả về một đường dẫn mặc định nếu không có productId
    }
  }

  onAddToCart(products1: Products[]) {
    console.log('Products:', products1);
    const productIds: number[] = products1.map(product => product.id);
    console.log('Product IDs:', productIds);

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!this.cartSv.isLoggedIn()) {
      alert('Please login to add products to cart.');
      return; // Stop further execution
    }
    
    // Tiếp tục thêm sản phẩm vào giỏ hàng nếu người dùng đã đăng nhập
    this.cartSv.createCart(productIds).subscribe(
      (response: any) => {
        console.log('Cart created:', productIds);
        alert('Add to cart successfully');
      },
      (error: any) => {
        console.error(error);
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          alert('Add to cart failed');
        }
      }
    );
  }
  //Phuong thuc de tinh toan so trang
  getPages(): number[] {
    const totalPages = Math.ceil(this.products1.length / this.itemsPerPage);
    return Array.from({length: totalPages}, (_, index) => index + 1);
  }

  //Phuong thuc de lay tong so trang
  getTotalPages(): number {
    return Math.ceil(this.products1.length / this.itemsPerPage);
  }

  // Phương thức để thay đổi trang và ngăn chặn hành vi mặc định
  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let minPrice = 0;
    let maxPrice = 0;

    switch(target.id){
      case 'price-1':
        minPrice = 0;
        maxPrice = 1000000;
        break;
      case 'price-2':
        minPrice = 1000000;
        maxPrice = 2000000;
        break;
      case 'price-3':
        minPrice = 2000000;
        maxPrice = 3000000;
        break;
      case 'price-4':
        minPrice = 3000000;
        maxPrice = 4000000;
        break;
      case 'price-5':
        minPrice = 4000000;
        maxPrice = 5000000;
        break;
      case 'price-all':
        this.getAllPrices();
        return;
      default:
        return;
    }
    this.applyPriceFilter(minPrice, maxPrice);
  }

  applyPriceFilter(minPrice: number, maxPrice: number) {
    this.products1 = this.priceRangePipe.transform(this.products1,'', minPrice, maxPrice); // Use the pipe
  }

  getAllPrices(){
    this.productService.getListPrice(0, Number.MAX_SAFE_INTEGER).subscribe(products => {
      console.log(products);
      this.products1 = products;
    });
  }
}
