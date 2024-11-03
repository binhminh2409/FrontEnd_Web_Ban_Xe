import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckOutService } from '../../service/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Order } from '../../models/Order';
import { IpServiceService } from '../../service/ip-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  carts: Cart[] = [];
  checkoutForm: FormGroup;
  cities: any[] = [];
  districts: any[] = [];
  filteredDistricts: any[] = [];
  selectedCityId: string | null = null;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckOutService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ipSV: IpServiceService,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      shipName: ['', Validators.required],
      shipAddress: ['', Validators.required],
      shipEmail: ['', [Validators.required, Validators.email]],
      shipPhone: ['', Validators.required],
      payment: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();
    this.loadLocations(); // Load the city and district data
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  loadCheckoutData(): void {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.ipSV.getIpAddress().subscribe(
        (response: { ip: string }) => {
          const guiId = response.ip;
          const cartCheckout = sessionStorage.getItem('CartCheckout');
          if (cartCheckout) {
            this.carts = JSON.parse(cartCheckout) as Cart[];
          } else {
            this.cartService.getCart(null, guiId).subscribe(
              (res: any) => {
                if (res?.data && Array.isArray(res.data)) {
                  this.carts = res.data.map((item: any) => {
                    return { ...new Cart(), ...item };
                  });
                }
              },
              (error) => {
                console.error('Error response from getCart API for guest user:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error while retrieving IP address:', error);
          alert('Cannot retrieve IP address. Please try again.');
        }
      );
    } else {
      const userId = this.authService.DecodeToken();
      this.cartService.getCart(userId, null).subscribe(
        (res: any) => {
          if (res?.data && Array.isArray(res.data)) {
            this.carts = res.data.map((item: any) => {
              return { ...new Cart(), ...item };
            });
          }
        },
        (error) => {
          console.error('Error response from getCart API for logged-in user:', error);
        }
      );
    }
  }

  loadLocations(): void {
    // Load cities
    this.http.get<any[]>('/assets/statics/cities.json').subscribe(data => {
      this.cities = data;
    });

    // Load districts
    this.http.get<any[]>('/assets/statics/districts.json').subscribe(data => {
      this.districts = data;
    });
  }

  onCityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    this.selectedCityId = selectElement.value; // Now TypeScript recognizes the value property
    this.filteredDistricts = this.districts.filter(district => district.city_id === this.selectedCityId);
    this.checkoutForm.get('district')?.setValue(''); // Reset district selection
  }


  getImageUrl(cart: Cart): string {
    const hostUrl = "https://localhost:5001/api";
    return cart?.productId ? `${hostUrl}/Products/images/product/${cart.productId}` : "Id not found";
  }

  calculateTotal(): number {
    return this.carts.reduce((total, cart) => total + cart.totalPrice, 0);
  }

  async onCreate(): Promise<void> {
    if (this.checkoutForm.invalid) {
      console.error("Form is invalid");
      return;
    }

    // Concatenate city and district to the shipAddress
    const selectedCity = this.cities.find(city => city.id === this.checkoutForm.value.city)?.name;
    const selectedDistrict = this.filteredDistricts.find(district => district.id === this.checkoutForm.value.district)?.name;
    const shipAddress = `${this.checkoutForm.value.shipAddress}, ${selectedDistrict}, ${selectedCity}`;

    const userID = this.authService.isLoggedIn() ? this.authService.DecodeToken() : null;

    // Prepare the order data
    const orderData: any = {
      userID: userID ? userID : null,
      shipName: this.checkoutForm.value.shipName,
      shipAddress: shipAddress,
      shipEmail: this.checkoutForm.value.shipEmail,
      shipPhone: this.checkoutForm.value.shipPhone,
      payment: this.checkoutForm.value.payment,
      cart: this.carts.map(item => item.productId)  // Extract product IDs from the cart
    };

    try {
      const response = await this.checkoutService.create(orderData).toPromise();
      console.log(response);

      if (response && response.success) {
        // Clear cart after successful order creation
        for (const productId of orderData.cart) {
          await this.cartService.deleteCart(productId).toPromise();
        }
        console.log('Cart has been successfully cleared');
        this.router.navigate(['/my-orders']);
      } else {
        console.error("An error occurred while creating the order:", response?.message || 'Unknown error');
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  }

}
