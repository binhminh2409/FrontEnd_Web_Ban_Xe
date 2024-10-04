import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailService } from '../../service/product-detail.service';
import { GetProductsByNameAndColor } from '../../models/GetProductsByNameAndColor';
import { ProductDetails } from '../../models/GetProductsByNameAndColor';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productName: string = '';
  color: string | null = null;
  products: ProductDetails[] = [];  // Chứa danh sách sản phẩm
  allColors: string[] = [];  // Chứa danh sách các màu có sẵn từ API

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailService: ProductDetailService
  ) { }

  ngOnInit(): void {
    this.productName = this.route.snapshot.paramMap.get('productName') || '';

    this.route.queryParams.subscribe(params => {
      this.color = params['color'] || null;
      this.fetchProductsByNameAndColor(this.productName);
    });
  }

  fetchProductsByNameAndColor(productName: string): void {
    const finalColor = this.color || ''; // Sử dụng chuỗi rỗng thay vì null
  
    console.log('Tên sản phẩm:', productName);
    console.log('Màu sắc truyền vào API:', finalColor); // Log màu sắc để kiểm tra
  
    this.productDetailService.GetProductsByNameAndColor(productName, finalColor).subscribe(
      (response: GetProductsByNameAndColor) => {
        console.log('Phản hồi từ API:', response); // Log phản hồi từ API
  
        if (response.success) {
          if (Array.isArray(response.data.productDetails)) {
            this.products = response.data.productDetails; // Gán danh sách sản phẩm
          } else if (response.data.productDetail) {
            this.products = [response.data.productDetail]; // Gán sản phẩm chi tiết nếu có
          } else {
            this.products = []; // Nếu không có sản phẩm nào, gán rỗng
          }
  
          this.allColors = response.data.availableColors || []; // Gán danh sách màu sắc
  
          if (this.products.length === 0) {
            console.log('Không có sản phẩm nào với màu sắc đã chọn.');
          }
  
          console.log('Dữ liệu sản phẩm trả về:', this.products);
          console.log('Tất cả các màu:', this.allColors);
        } else {
          console.error('Không lấy được sản phẩm:', response.message);
        }
      },
      (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    );
  }

  onColorClick(color: string): void {
    console.log('Màu đã chọn:', color);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { color: color },
      queryParamsHandling: 'merge',
    });
  }

  getImageUrl(data: ProductDetails): string {
    const HostUrl = "https://localhost:7066/api";
    return data && data.id ? `${HostUrl}/Products/images/product/${data.id}` : '';
  }
}
