import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { AuthService } from '../../service/auth.service';
import { CartService } from '../../service/cart.service';
import { IpServiceService } from '../../service/ip-service.service';
import { Cart_Response } from '../../models/Cart';
import { Cart } from '../../models/Cart';
import { ProductSearch } from '../../models/ProductSearch';
import { HerderService } from '../../service/herder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDropdownVisible: boolean = false;
  isLogin = false;
  userName = '';
  cartCount: number = 0;
  intervalId: any;

  keyword: string = '';
  productSearchResults: ProductSearch[] = [];

  constructor(private loginSrv: LoginService,
    private auth: AuthService,
    private cartService: CartService,
    private ipSv: IpServiceService,
    private herderService: HerderService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.isLogin = this.auth.isLoggedIn();
    if (this.isLogin) {
      this.userName = this.auth.getUserNameFromToken();
    }
    this.startCartCountUpdater();
  }

  onLogout() {
    this.loginSrv.logout().subscribe(
      response => {
        console.log('Logout successful:', response);
      },
      error => {
        console.error('Error logging out', error);
      }
    );
  }

  startCartCountUpdater(): void {
    this.loadCartCount();

    this.intervalId = setInterval(() => {
      if (this.isLogin) {
        this.loadCartCount();
      } else {
        this.checkCartCountFromSession();
      }
    }, 1000);
  }

  loadCartCount(): void {
    const userId = this.auth.DecodeToken();
    this.cartService.getCartSl(userId, null).subscribe(
      (res: Cart_Response) => {
        if (res?.data && Array.isArray(res.data)) {
          this.cartCount = res.totalCount;
        }
      },
      (error) => {
        console.error('Error response from getCart API for logged-in user:', error);
      }
    );
  }

  checkCartCountFromSession(): void {
    const cartCheckout = sessionStorage.getItem('CartCheckout');
    if (cartCheckout) {
      console.log('Cart data found in session storage');
      const cartData = JSON.parse(cartCheckout) as Cart[];
      this.cartCount = cartData.length;
      console.log('Total count of items in cart for guest user:', this.cartCount);
    } else {
      this.ipSv.getIpAddress().subscribe(
        (response: { ip: string }) => {
          const guiId = response.ip;

          this.cartService.getCartSl(null, guiId).subscribe(
            (res: Cart_Response) => {
              if (res?.data && Array.isArray(res.data)) {
                this.cartCount = res.totalCount;
                console.log('Total count of items in cart for guest user:', this.cartCount);
              }
            },
            (error) => {
              console.error('Error response from getCart API for guest user:', error);
            }
          );
        },
        (error) => {
          console.error('Error while retrieving IP address:', error);
          alert('Không th? l?y d?a ch? IP. Vui lòng th? l?i.');
        }
      );
    }
  }

  productSearchKey() {
    if (this.keyword) {
      this.router.navigate(['/form-search'], { queryParams: { keyword: this.keyword } });
    }
  }
}
