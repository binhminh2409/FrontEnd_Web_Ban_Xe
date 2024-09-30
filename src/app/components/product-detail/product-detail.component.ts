import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {

  productId: string = '';
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.productId); // Kiểm tra giá trị productId
  }
}
