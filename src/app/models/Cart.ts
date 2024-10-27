export class Cart {
  cartId: number = 0;
  productId: number = 0;
  productName: string = "";
  totalPrice: number = 0;
  priceProduct: number = 0;
  quantity: number = 0;
  image: string = "";
  color: string = "";
}

export interface Cart_Response {
  success: boolean;
  httpStatusCode: number;
  message: string;
  data: Cart[]; // Đối tượng Cart
  totalCount: number;
}