import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../service/payment.service';
import { PaymentDto } from '../../models/PaymentDto';
import { OrderService } from '../../service/order.service';
import { OrderWithDetail } from '../../models/OrderWithDetails';
import { QrService } from '../../service/qr.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DeliveryComponent } from '../delivery/delivery.component';
import { DeliveryService } from '../../service/delivery.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  orderId!: number; // Store the order ID
  order!: OrderWithDetail; // Store the fetched order details
  paymentDto!: PaymentDto;
  loadingQrCode = true; // Loading state for QR code
  qrCodeUrl!: SafeUrl; // Safe URL for QR code
  paymentProcessing: boolean = false;
  cities: any[] = [];
  districts: any[] = [];

  // Params for QR
  bank = 'Techcombank';
  accountNumber = '8896898888';
  amount = "";
  ndck = 'Test';
  fullName = 'Vuong Quoc Binh Minh';

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router,
    private qrService: QrService,
    private sanitizer: DomSanitizer,
    private deliveryService: DeliveryService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      this.orderId = +params['orderId']; // Retrieve the order ID from the route
      this.loadLocations();
      // Wait for fetchOrderDetails to complete before calling fetchQrCode
      await this.fetchOrderDetails();
      this.fetchQrCode(); // Fetch QR code for payment
    });
  }

  calculateTotalPrice(order: OrderWithDetail): number {
    var totalPrice = 0;
    for (let orderDetail of order.orderDetails) {
      totalPrice += (orderDetail.priceProduc || 0) * (orderDetail.quantity || 0);
    }
    return totalPrice;
  }

  fetchOrderDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.ndck = order.no_;
          var orderAmount = 0; 
          for (let orderDetail of this.order.orderDetails) {
            orderAmount += (orderDetail.priceProduc || 0) * (orderDetail.quantity || 0);
          }
          this.amount = String(orderAmount);
          console.log("amount:" + this.amount);
          this.initializePayment();
          resolve();
        },
        error: (error) => {
          console.error("Error fetching order details:", error);
          reject(error);
        }
      });
    });
  }

  initializePayment() {
    if (this.order && this.order.orderDetails) {
      let totalPrice = 0;

      for (let orderDetail of this.order.orderDetails) {
        totalPrice += (orderDetail.priceProduc || 0) * (orderDetail.quantity || 0);
      }
    
      this.paymentDto = {
        id: 0, // Backend generates ID
        userId: this.order.userID ?? 0,
        orderId: this.order.id ?? 0,
        method: "BANKTRANSFER",
        totalPrice: totalPrice,
        status: 'Pending',
        createdTime: new Date(),
        updatedTime: new Date()
      };

      this.paymentService.createPayment(this.paymentDto).subscribe({
        next: response => {
          this.paymentDto = response;
          console.log('Payment processed successfully:', response);
        },
        error: error => {
          console.error('Payment processing failed:', error);
        }
      });
    } else {
      console.error('Order details are missing');
    }
  }

  fetchQrCode(): void {
    console.log("Amount: " + this.amount);
    var qrUrl = this.qrService.getQrCode(this.bank, this.accountNumber, this.amount, this.ndck, this.fullName);
    this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(qrUrl);
    this.loadingQrCode = false;
  }

  extractAddressComponents(address: string): { cityId: string, districtId: string } {
    const parts = address.split(',').map(part => part.trim());
    
    const cityName = parts.pop() || '';        // Extract the last part as the city
    const districtName = parts.pop() || '';     // Extract the second last part as the district
    
    const city = this.cities.find(city => city.name === cityName);          // Find city ID
    const district = this.cities.find(district => district.name === districtName);  // Find district ID
  
    return { cityId: city ? city.id : "100000", districtId: district ? district.id : "100900" };
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

  onSubmitPayment() {
    console.log(this.paymentDto);
    this.paymentService.confirmPayment(this.paymentDto.id).subscribe({
      next: response => {
        console.log('Payment confirmed successfully:', response);
        this.paymentProcessing = true;
        var { cityId, districtId } = this.extractAddressComponents(this.order.shipAddress);


        // Call createDelivery and wait for it to complete before navigating
        this.deliveryService.createDelivery(this.paymentDto, cityId, districtId).subscribe({
          next: (deliveryResponse: any) => {
            console.log('Delivery created successfully:', deliveryResponse);
            this.router.navigate([`/payment/${this.paymentDto.orderId}/confirmed`]);
          },
          error: (deliveryError: any) => {
            console.error('Delivery creation failed:', deliveryError);
          }
        });
      },
      error: error => {
        console.error('Payment processing failed:', error);
      }
    });
  }


  getImageUrl(productID: number) {
    const HostUrl = "https://localhost:5001/api";
    return productID ? `${HostUrl}/Products/images/product/${productID}` : '';
  }
}
