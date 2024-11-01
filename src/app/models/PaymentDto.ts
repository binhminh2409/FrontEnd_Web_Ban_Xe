export interface PaymentDto {
    id: number;
    userId: number;
    orderId: number;
    totalPrice: number;
    status: string;
    method: string;
    createdTime: Date;
    updatedTime: Date;
}
