export interface GetProductsByNameAndColor {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: ProductDetails[]; // data là một mảng của ProductDetail
    totalCount: number;
  }
  
  export interface ProductDetails {
    id: number;
    productName: string;
    price: number;
    priceHasDecreased: number;
    description: string;
    image: string;
    brandName: string;
    typeName: string;
    colors: string;
    status: string; // Kiểu status đã được cập nhật ở đây
  }
  