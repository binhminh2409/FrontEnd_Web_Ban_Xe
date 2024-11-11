import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductSearch } from '../../models/ProductSearch';
import { HerderService } from '../../service/herder.service';

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.scss']
})
export class FormSearchComponent implements OnInit {
  keyword: string = '';
  productSearchResults: ProductSearch[] = [];

  itemsPerPage = 10;
  currentPage = 1;

  constructor(private route: ActivatedRoute, private herderSV: HerderService) { }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.searchProducts();
    });
  }

  searchProducts(): void {
    this.herderSV.searchKey(this.keyword).subscribe(
      (res: any) => {
        this.productSearchResults = res.data;
        this.currentPage = 1;
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getImageUrl(data: ProductSearch): string {
    const HostUrl = "https://localhost:5001/api";
    if (data && data.id) {
      return `${HostUrl}/Products/images/product/${data.id}`;
    } else {
      return '';
    }
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.productSearchResults.length / this.itemsPerPage);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.productSearchResults.slice(startIndex, endIndex);
  }
}


