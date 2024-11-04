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
  loading: boolean = false; 

  constructor(private deliveryService: DeliveryService) { }

  ngOnInit(): void {
    if (this.orderId) {
      this.getDeliveryDetails(this.orderId);
    }
  }

  getDeliveryDetails(orderId: number): void {
    console.log("Getting delivery");
    this.loading = true; // Start loading
  
    this.deliveryService.getDeliveryDetails(orderId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.delivery = response.data; // Accessing the data property directly
          console.log(this.delivery); // Log the delivery details
        } else {
          console.error('Delivery details not found in response:', response.message);
        }
        this.loading = false; // Stop loading when data is fetched
      },
      error: (err) => {
        console.error('Error fetching delivery details:', err);
        this.loading = false; // Stop loading if there is an error
      }
    });
  }
}
