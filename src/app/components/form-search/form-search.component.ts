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

  constructor(private route: ActivatedRoute, private herderSV: HerderService) { }

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
}


