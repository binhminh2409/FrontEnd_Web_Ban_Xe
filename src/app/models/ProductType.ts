export interface ProductType{
    id: number;
    productName: string;
    price: number;
    priceHasDecreased: number;
    description: string;
    image: string;
    brandId: number;
    brandName: string;
    typeId: number;
    typeName: string;
    colors: string;
    productType_ProductType: string;
}


export interface ProductResponseType {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: ProductType[];
    totalCount: number;
  }