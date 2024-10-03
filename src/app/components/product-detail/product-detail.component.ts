// ProductDetailComponent.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailService } from '../../service/product-detail.service'; 
import { GetProductsByNameAndColor } from '../../models/GetProductsByNameAndColor';
import { ProductDetails } from '../../models/GetProductsByNameAndColor';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  productName: string = '';
  products: ProductDetails[] = [];

  constructor(private route: ActivatedRoute, private productDetailService: ProductDetailService) {}

  ngOnInit(): void {
    // Giải mã productName từ URL
    this.productName = decodeURIComponent(this.route.snapshot.paramMap.get('productName') || '');
    console.log(this.productName);
    this.fetchProductsByNameAndColor(this.productName, 'someColor');
  }
  
  fetchProductsByNameAndColor(productName: string, color: string): void {
    this.productDetailService.GetProductsByNameAndColor(productName, color).subscribe(
      (response: GetProductsByNameAndColor) => { 
        if (response.success) {
          this.products = response.data;
          console.log(this.products);
        } else {
          console.error('Không lấy được sản phẩm:', response.message);
        }
      },
      (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    );
  }
}
