import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { OrderWithDetail } from '../../models/OrderWithDetails';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss']
})
export class ConfirmPaymentComponent implements OnInit {
  orderId: number | null = null;
  order: OrderWithDetail | null = null;
  loadingOrder = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('orderId');
      this.orderId = id ? +id : null;
      if (this.orderId) {
        this.fetchOrderDetails();
      }
    });
  }

  fetchOrderDetails() {
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: order => {
          this.order = order;
          this.loadingOrder = false;
        },
        error: () => {
          console.error('Failed to load order details');
          this.loadingOrder = false;
        }
      });
    }
  }
}
