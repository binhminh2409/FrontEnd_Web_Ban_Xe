import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailService } from '../../service/product-detail.service';
import { GetProductsByNameAndColor } from '../../models/GetProductsByNameAndColor';
import { ProductDetails } from '../../models/GetProductsByNameAndColor';
import { GetProducts_Detail } from '../../models/GetProducts_Detail';
import { environment } from '../../../environments/environment';
import { GetProducts_Detail_Response } from '../../models/GetProducts_Detail';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productName: string = '';
  color: string | null = null;
  products: ProductDetails[] = [];
  allColors: string[] = [];
  getProducts_Detail: GetProducts_Detail | undefined;
  productId: string | null = null;
  imageUrls: string[] = [];
  productDetail: GetProducts_Detail_Response | undefined; // Chỉnh sửa ở đây
  otherDetails: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailService: ProductDetailService,

  ) { }

  ngOnInit(): void {
    this.productName = this.route.snapshot.paramMap.get('productName') || '';
    this.productId = this.route.snapshot.paramMap.get('productId');
    console.log(this.productId);

    this.route.queryParams.subscribe(params => {
      this.color = params['color'] || null;
      this.fetchProductsByNameAndColor(this.productName);
    });

    if (this.productId) {
      this.GetProducts_Detail(parseInt(this.productId, 10));
    }
  }

  isImage(detail: any): boolean {
    return typeof detail === 'object' && detail.image;
  }
  

  fetchProductsByNameAndColor(productName: string): void {
    const finalColor = this.color || '';
    this.productDetailService.GetProductsByNameAndColor(productName, finalColor).subscribe(
      (response: GetProductsByNameAndColor) => {
        if (response.success) {
          if (Array.isArray(response.data.productDetails)) {
            this.products = response.data.productDetails;
          } else if (response.data.productDetail) {
            this.products = [response.data.productDetail];
          } else {
            this.products = [];
          }

          this.allColors = response.data.availableColors || [];

          if (this.products.length === 0) {
            console.log('Không có sản phẩm nào với màu sắc đã chọn.');
          }
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

  GetProducts_Detail(id: number): void {
    this.productDetailService.GetProducts_Detail(id).subscribe(
      (response: GetProducts_Detail_Response) => {
        this.getProducts_Detail = response.data;
        console.log(id);
        console.log('Product Detail:', this.getProducts_Detail);

        if (this.getProducts_Detail && this.getProducts_Detail.imgage) {
          const imagePaths = this.getProducts_Detail.imgage.split(';');
          this.imageUrls = imagePaths.map((imagePath: string) => {
            return `${environment.apiUrl}${imagePath}`;
          });
          console.log('Full Image Paths:', this.imageUrls);
        }
        if (this.getProducts_Detail && this.getProducts_Detail.other_Details) {
          const detailString = this.getProducts_Detail.other_Details;
          if (detailString.includes(';')) {
            this.otherDetails = detailString.split(';');
          } else {
            this.otherDetails = [detailString];
          }
        }
      },
      (error) => {
        console.error('Error fetching product detail:', error);
      }
    );
  }

  get formattedDetails(): (string | { image: string })[] {
    const detailsArray = this.otherDetails;
    const imageUrls = this.imageUrls;

    const combinedArray: (string | { image: string })[] = [];
    const totalImages = imageUrls.length;
    const totalDetails = detailsArray.length;

    const detailsPerImage = Math.ceil(totalDetails / (totalImages + 1));

    let currentDetailIndex = 0;

    for (let i = 0; i < totalImages; i++) {
        combinedArray.push({ image: imageUrls[i] });
        const startIndex = currentDetailIndex;
        const endIndex = Math.min(startIndex + detailsPerImage, totalDetails);

        if (startIndex < totalDetails) {
            combinedArray.push(...detailsArray.slice(startIndex, endIndex));
            currentDetailIndex = endIndex;
        }
    }
    if (currentDetailIndex < totalDetails) {
        const remainingDetails = detailsArray.slice(currentDetailIndex);
        combinedArray.push(...remainingDetails);
    }

    return combinedArray;
}
}
