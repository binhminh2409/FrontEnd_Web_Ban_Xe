import { Component, Input, OnInit } from '@angular/core';
import { DeliveryService } from '../../service/delivery.service'; // Adjust the path as necessary
import { Delivery } from '../../models/Delivery'; // Create this model based on the expected response

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  @Input() orderId: number | null = null;
  delivery: Delivery | null = null;

  constructor(private deliveryService: DeliveryService) { }

  ngOnInit(): void {
    if (this.orderId) {
      this.getDeliveryDetails(this.orderId);
    }
  }

  getDeliveryDetails(orderId: number): void {
    this.deliveryService.getDeliveryDetails(orderId).subscribe({
      next: (delivery) => {
        this.delivery = delivery;
      },
      error: (err) => {
        console.error('Error fetching delivery details:', err);
      }
    });
  }
  
}
