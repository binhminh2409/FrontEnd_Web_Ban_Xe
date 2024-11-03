import { OrderDetail } from "./Order_Details";

export interface OrderWithDetail {
    id: number | null;
    userID: number | null;
    shipName: string;
    shipAddress: string;
    shipEmail: string;
    shipPhone: string;
    cart: number[];
    no_: string;
    status: string;
    orderDetails: OrderDetail
  }
