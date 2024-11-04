import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { OrderWithDetail } from '../../models/OrderWithDetails';
import { OrderDetail } from '../../models/Order_Details';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: OrderWithDetail[] = [];
  deliveryDetails: { [orderId: number]: boolean } = {};

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    const userId = this.orderService.getUserIdFromToken();
    if (userId) {
      this.fetchOrdersWithDetails(userId);
    } else {
      console.error('User ID not found in token');
    }
  }

  getImageUrl(productID: number): string {
    const HostUrl = "https://localhost:5001/api";
    return productID ? `${HostUrl}/Products/images/product/${productID}` : '';
  }

  fetchOrdersWithDetails(userId: number) {
    this.orderService.getOrdersWithDetailsByUserId(userId)
      .subscribe(
        (data: OrderWithDetail[]) => {
          console.log(data);
          this.orders = data;
        },
        error => {
          console.error('Error fetching orders:', error);
        }
      );
  }

  openPayment(order: any) {
    this.router.navigate(['/payment', order.id]);
  }

  cancelOrder(orderId: number) {
    this.orderService.cancelOrder(orderId).subscribe({
      next: (response) => {
        if (response.success) {
          const order = this.orders.find(o => o.id === orderId);
          if (order) {
            order.status = 'Cancelled'; 
          }
        } 
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
      }
    });
  }

  toggleTrackDelivery(orderId: number) {
    this.deliveryDetails[orderId] = !this.deliveryDetails[orderId];
  }
}
