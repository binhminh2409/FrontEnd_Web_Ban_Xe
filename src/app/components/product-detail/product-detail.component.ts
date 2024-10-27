import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailService } from '../../service/product-detail.service';
import { GetProductsByNameAndColor } from '../../models/GetProductsByNameAndColor';
import { ProductDetails } from '../../models/GetProductsByNameAndColor';
import { GetProducts_Detail } from '../../models/GetProducts_Detail';
import { environment } from '../../../environments/environment';
import { GetProducts_Detail_Response } from '../../models/GetProducts_Detail';
import { CommentModel } from '../../models/Comment';
import { AuthService } from '../../service/auth.service';
import { CommentService } from '../../service/comment.service';
import { CartService } from '../../service/cart.service';
import { GetCommentModel } from '../../models/GetCommentModel';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpServiceService } from '../../service/ip-service.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('commentBox', { static: false }) commentBox!: ElementRef; // Thêm ViewChild cho phần tử chứa bình luận
  isDetailsVisible = false;
  productName: string = '';
  color: string | null = null;
  products: ProductDetails[] = [];
  allColors: string[] = [];
  getProducts_Detail: GetProducts_Detail | undefined;
  productId: string | null = null;
  imageUrls: string[] = [];
  productDetail: GetProducts_Detail_Response | undefined; // Chỉnh sửa ở đây
  otherDetails: string[] = [];
  // Khai báo các biến với kiểu dữ liệu thích hợp
  commentText: string = '';
  userName: string = '';
  comments: { userName: string; content: string }[] = []; // Mảng chứa các bình luận
  loadcomments: GetCommentModel[] = [];
  userId: number = 0;
  productId1: number = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailService: ProductDetailService,
    private authSV: AuthService,
    private commentSV: CommentService,
    private cartSv: CartService,
    private decode: JwtHelperService,
    private ipSV: IpServiceService

  ) { }

  ngOnInit(): void {
    this.productName = this.route.snapshot.paramMap.get('productName') || '';
    this.productId = this.route.snapshot.paramMap.get('productId');

    if (this.productId) {
      this.GetProducts_Detail(parseInt(this.productId, 10));
    }

    this.route.queryParams.subscribe(params => {
      this.color = params['color'] || null;
      this.fetchProductsByNameAndColor(this.productName);
    });

    if (this.productId) {
      this.GetProducts_Detail(parseInt(this.productId, 10));
    }

    this.loadComments(); // Tải bình luận
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
    const HostUrl = "https://localhost:5001/api";
    return data && data.id ? `${HostUrl}/Products/images/product/${data.id}` : '';
  }

  GetProducts_Detail(id: number): void {
    this.productDetailService.GetProducts_Detail(id).subscribe(
      (response: GetProducts_Detail_Response) => {
        this.getProducts_Detail = response.data;
        if (this.getProducts_Detail && this.getProducts_Detail.imgage) {
          const imagePaths = this.getProducts_Detail.imgage.split(';');
          this.imageUrls = imagePaths.map((imagePath: string) => {
            return `${environment.apiUrl}${imagePath}`;
          });
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

  onSubmitComment() {
    if (this.commentText) {
      if (!this.cartSv.isLoggedIn()) {
        const userConfirmed = confirm('You are not logged in. Do you want to log in?');
        if (userConfirmed) {
          this.router.navigate(['/login']);
        }
        return;
      }

      const userId = parseInt(this.authSV.DecodeToken(), 10);
      const productId = parseInt(this.productId || '0', 10);
      const newComment: CommentModel = {
        UserId: userId,
        ProductId: productId,
        Description: this.commentText,
      };

      console.log('Submitting comment:', newComment);

      this.commentSV.create(newComment).subscribe(
        response => {
          console.log('Response from server:', response);
          if (response.success) {
            console.log('Bình luận đã được tạo thành công:', response);
            this.comments.push({
              userName: `User ${userId}`,
              content: this.commentText
            });
            this.scrollToBottom();
            this.commentText = '';
          } else {
            console.error('Lỗi khi tạo bình luận:', response.message);
          }
        },
        error => {
          console.error('Lỗi khi gửi bình luận:', error);
        }
      );
    } else {
      console.warn('Vui lòng nhập nội dung bình luận.');
    }
  }

  scrollToBottom() {
    const container = document.querySelector('.comments-container') as HTMLElement;
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }

  loadComments(): void {
    const userId = parseInt(this.authSV.DecodeToken(), 10);
    const productId = parseInt(this.productId || '0', 10);
    console.log('userId:', userId, 'productId:', productId);
    console.log('Loading comments for userId:', userId, 'and productId:', productId);

    if (!isNaN(userId) && !isNaN(productId)) {
      this.commentSV.getComment(userId, productId).subscribe(
        (response) => {
          if (response.success) {
            console.log('Dữ liệu bình luận nhận được:', response.data);
            this.comments = response.data.map(comment => ({
              userName: `User ${comment.userId}`,
              content: comment.description
            }));

            // Cuộn xuống dưới cùng sau khi nhận bình luận
            this.scrollToBottom(); // Gọi để cuộn đến cuối sau khi tải bình luận
          } else {
            console.error('Không thể lấy bình luận');
          }
        },
        (error) => {
          console.error('Lỗi khi lấy bình luận:', error);
        }
      );
    } else {
      console.error('Giá trị userId hoặc productId không hợp lệ');
    }
  }

  onAddToCart(producPrice: ProductDetails[]) {
    const productIds: number[] = producPrice.map(product => product.id);
    let guiId: string | null = null;
  
    if (!this.cartSv.isLoggedIn()) {
      const userConfirmed = confirm('You are not logged in. Do you want to log in to save your items forever?');
      
      if (userConfirmed) {
        this.router.navigate(['/login']);
        return;
      } else {
        this.ipSV.getIpAddress().subscribe(
          (response: {ip: string}) => {
            guiId = response.ip;
            this.cartSv.createCart(productIds, guiId).subscribe(
              (response: any) => {
                alert('Add to cart successfully');
              },
              (error: any) => {
                console.error('Lỗi:', error);
                alert(error.error?.message || 'Add to cart failed');
              }
            );
          },
          (error) => {
            alert('Không thể lấy địa chỉ IP. Vui lòng thử lại.');
          }
        );
      }
    } else {
      const token = localStorage.getItem('token');
      let userId: number | null = null;
      if (token) {
        const decodedToken = this.decode.decodeToken(token);
        userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          ? parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])
          : null;
      }
      if (!userId) {
        alert('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      this.cartSv.createCart(productIds, guiId).subscribe(
        (response: any) => {
          alert('Add to cart successfully');
        },
        (error: any) => {
          console.error('Lỗi:', error);
          alert(error.error?.message || 'Add to cart failed');
        }
      );
    }
  }
}
