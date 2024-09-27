export interface Product_Price {
    id: number;
    productName: string;
    price: number;
    priceHasDecreased: number;
    image: string;
    brandNamer: string;
}

export interface ProductResponse {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: Product_Price[];
    totalCount: number;
  }
  