import { PaymentDto } from "./PaymentDto";  // Import the Payment interface

export interface Delivery {
    id: number;
    userId: number;
    no_: string;  
    status: string;
    payment?: PaymentDto;  
    createdTime: Date;  
    updatedTime: Date;  
}
