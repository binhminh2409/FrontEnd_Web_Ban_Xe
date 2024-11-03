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
    private deliveryService: DeliveryService
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      this.orderId = +params['orderId']; // Retrieve the order ID from the route
  
      // Wait for fetchOrderDetails to complete before calling fetchQrCode
      await this.fetchOrderDetails();
      this.fetchQrCode(); // Fetch QR code for payment
    });
  }
  
fetchOrderDetails(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.amount = String(this.order.orderDetails.totalPrice);
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
      this.paymentDto = {
        id: 0,  // Backend generates ID
        userId: this.order.userID ?? 0,
        orderId: this.order.id ?? 0,
        method: "BANKTRANSFER",
        totalPrice: this.order.orderDetails.totalPrice || 0,
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
    this.loadingQrCode = true;
    console.log("Amount amount " + this.amount)
    this.qrService.getQrCode(this.bank, this.accountNumber, this.amount, this.ndck, this.fullName)
      .subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          this.loadingQrCode = false;
        },
        error: (err) => {
          console.error('Error fetching QR code:', err);
          this.loadingQrCode = false;
        }
      });
  }

  onSubmitPayment() {
    console.log(this.paymentDto);
    this.paymentService.confirmPayment(this.paymentDto.id).subscribe({
      next: response => {
        console.log('Payment confirmed successfully:', response);
        this.paymentProcessing = true;
        // Call createDelivery and wait for it to complete before navigating
        this.deliveryService.createDelivery(this.paymentDto).subscribe({
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
