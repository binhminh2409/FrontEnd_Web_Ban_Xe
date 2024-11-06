import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { OrderWithDetail } from '../../models/OrderWithDetails';
import { OrderDetail } from '../../models/Order_Details';
import { IpServiceService } from '../../service/ip-service.service';


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
    private router: Router,
    private ipSV: IpServiceService,

  ) { }

  ngOnInit() {
    const userId = this.orderService.getUserIdFromToken();
    if (userId) {
      this.fetchOrdersWithDetails(userId);
    } else {
      this.ipSV.getIpAddress().subscribe(
        (response: { ip: string }) => {
          console.log("9999999999")
          const guiId = response.ip;
          this.fetchOrdersWithDetailsGuid(guiId);
          console.log('User ID not found in token');
        }),
        (error: any) => {
          console.error('Error while retrieving IP address:', error);
          alert('Cannot retrieve IP address. Please try again.');
        }
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

  fetchOrdersWithDetailsGuid(guid: string) {
    this.orderService.getOrdersWithDetailsByGuid(guid)
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
