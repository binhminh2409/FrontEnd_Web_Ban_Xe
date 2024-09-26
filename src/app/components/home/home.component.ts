import { Component, OnInit } from '@angular/core';
import { Slide } from '../../models/Slide';
import { AppService } from '../../service/app.service';
import { SlideService } from '../../service/slide.service';

// Định nghĩa giao diện cho đối tượng sản phẩm
interface Product {
  id: string;
}
interface Slides {
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any;
  products1: any;
  slides: Slide[] = [];

  constructor(private app: AppService, private slideSv: SlideService) { }

  ngOnInit(): void {
    this.getProducts_Xe_moi_ve();
    this.getProduct_Xe_tre_em();
    this.getSlide();
  }

  getProducts_Xe_moi_ve(): void {
    this.app.productsXemoive(8).subscribe(
      (res: any) => {
        this.products = res.data;
        console.log('Dữ liệu trả về:', this.products);
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  getProduct_Xe_tre_em(): void {
    this.app.productsXetreem(8).subscribe(
      (res: any) => {
        this.products1 = res.data;
        console.log('Dữ liệu trả về:', this.products1);
      },
      (error: any) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );
  }

  // Phương thức để lấy URL hình ảnh dựa trên id của sản phẩm
  getImageUrl(data: Product): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.id) {
      return `${HostUrl}/Products/images/product/${data.id}`;
    } else {
      return ''; // hoặc bạn có thể trả về một đường dẫn mặc định nếu không có productId
    }
  }

  getSlide(): void {
    this.slideSv.getSlide().subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        this.slides = res.data;
        console.log(this.slides);
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', res);
      }
    });
  }

  //getImage slide 
  getImageUrlSile(data: Slides): string {
    const HostUrl = "https://localhost:7066/api";
    if (data && data.id) {
      console.log("ID của slide:", data.id);
      return `${HostUrl}/Slide/images/slide/${data.id}`;
    } else {
      return '';
    }
  }
  getImageUrlSile4(){
    const HostUrl = "https://localhost:7066/api"
    const slideId = 4
    return `${HostUrl}/Slide/images/slide/4`
  }
  getImageUrlSile5(){
    const HostUrl = "https://localhost:7066/api"
    const slideId = 5
    return `${HostUrl}/Slide/images/slide/5`
  }
}
