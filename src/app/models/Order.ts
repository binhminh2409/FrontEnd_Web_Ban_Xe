export interface Order {
    userID: number | null;
    shipName: string;
    shipAddress: string;
    shipEmail: string;
    shipPhone: string;
    cart: number[];
  }