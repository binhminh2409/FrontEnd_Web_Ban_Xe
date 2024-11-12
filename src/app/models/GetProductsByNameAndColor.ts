export interface GetProductsByNameAndColor {
  success: boolean;
  httpStatusCode: number;
  message: string;
  data: ProductData;
  totalCount: number;
}

export interface ProductData {
  productDetail: ProductDetails | null;
  productDetails: ProductDetails[];
  availableColors: string[];
  availableSize: string[];
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
  colors: string[];
  size: string[];
  status: string;
}
